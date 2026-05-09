<?php

namespace App\Services;

use App\Services\Supabase\SupabaseHttp;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class StorageService
{
    public static function uploadFile(string $bucket, string $folder, UploadedFile $file): string
    {
        $ext = $file->getClientOriginalExtension() ?: 'bin';
        $name = $folder.'/'.Str::uuid()->toString().'.'.$ext;
        $contents = file_get_contents($file->getRealPath()) ?: '';
        $mime = $file->getMimeType() ?: 'application/octet-stream';

        $r = SupabaseHttp::storageUpload($bucket, $name, $contents, $mime);
        if (! $r->successful()) {
            throw new \RuntimeException('Failed to upload file to '.$bucket);
        }

        return SupabaseHttp::publicObjectUrl($bucket, $name);
    }
}
