<?php

namespace App\Services\Supabase;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;

/**
 * HTTP bridge to Supabase Auth + PostgREST (same as legacy Node supabase-js client).
 */
class SupabaseHttp
{
    public static function base(): string
    {
        return rtrim(config('supabase.url'), '/');
    }

    public static function serviceKey(): string
    {
        return (string) config('supabase.service_role_key');
    }

    /** @return array<string, string> */
    public static function serviceHeaders(bool $withPrefer = true): array
    {
        $k = self::serviceKey();
        $h = [
            'apikey' => $k,
            'Authorization' => 'Bearer '.$k,
            'Content-Type' => 'application/json',
        ];
        if ($withPrefer) {
            $h['Prefer'] = 'return=representation';
        }

        return $h;
    }

    public static function getUser(string $accessToken): ?array
    {
        $url = self::base().'/auth/v1/user';
        $r = Http::withHeaders([
            'apikey' => self::serviceKey(),
            'Authorization' => 'Bearer '.$accessToken,
        ])->get($url);

        if (! $r->successful()) {
            return null;
        }

        return $r->json('user');
    }

    public static function authPost(string $path, array $body, array $query = []): Response
    {
        $url = self::base().'/auth/v1/'.$path;
        $q = $query ? '?'.http_build_query($query) : '';

        return Http::withHeaders([
            'apikey' => self::serviceKey(),
            'Authorization' => 'Bearer '.self::serviceKey(),
            'Content-Type' => 'application/json',
        ])->post($url.$q, $body);
    }

    /**
     * PostgREST request to /rest/v1/{table}.
     *
     * @param  array<string, mixed>  $query
     */
    public static function rest(string $method, string $table, array $query = [], mixed $body = null, array $extraHeaders = []): Response
    {
        $qs = $query !== [] ? '?'.http_build_query($query, '', '&', PHP_QUERY_RFC3986) : '';
        $url = self::base().'/rest/v1/'.$table.$qs;
        $headers = array_merge(self::serviceHeaders(), $extraHeaders);
        $client = Http::withHeaders($headers);

        return match (strtoupper($method)) {
            'GET' => $client->get($url),
            'POST' => $client->post($url, is_array($body) ? $body : []),
            'PATCH' => $client->patch($url, is_array($body) ? $body : []),
            'DELETE' => $client->delete($url),
            default => throw new \InvalidArgumentException('Unsupported method: '.$method),
        };
    }

    /**
     * Upload to Supabase Storage (service role).
     */
    public static function storageUpload(string $bucket, string $path, string $contents, string $contentType): Response
    {
        $url = self::base().'/storage/v1/object/'.$bucket.'/'.$path;

        return Http::withHeaders([
            'apikey' => self::serviceKey(),
            'Authorization' => 'Bearer '.self::serviceKey(),
            'Content-Type' => $contentType,
            'x-upsert' => 'true',
        ])->withBody($contents, $contentType)->post($url);
    }

    public static function publicObjectUrl(string $bucket, string $path): string
    {
        $ref = self::base().'/storage/v1/object/public/'.$bucket.'/'.$path;

        return $ref;
    }
}
