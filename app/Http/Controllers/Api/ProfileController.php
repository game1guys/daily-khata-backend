<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Supabase\SupabaseHttp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ProfileController extends Controller
{
    public function me(Request $request): JsonResponse
    {
        $user = $request->attributes->get('supabase_user');
        if (! $user || empty($user['id'])) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $r = SupabaseHttp::rest('GET', 'profiles', [
            'select' => 'full_name,phone,subscription_tier,subscription_end_date,created_at',
            'id' => 'eq.'.$user['id'],
            'limit' => 1,
        ]);

        $profile = null;
        if ($r->successful() && is_array($r->json()) && count($r->json()) > 0) {
            $profile = $r->json()[0];
        }

        $meta = $user['user_metadata'] ?? [];

        return response()->json([
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'] ?? null,
                'full_name' => $profile['full_name'] ?? ($meta['full_name'] ?? 'User'),
                'phone' => $profile['phone'] ?? ($meta['phone'] ?? null),
            ],
            'subscription' => [
                'tier' => $profile['subscription_tier'] ?? 'free',
                'end_date' => $profile['subscription_end_date'] ?? null,
            ],
            'member_since' => $profile['created_at'] ?? ($user['created_at'] ?? null),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $user = $request->attributes->get('supabase_user');
        if (! $user || empty($user['id'])) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $full_name = $request->input('full_name');
        $phone = $request->input('phone');
        $fcm_token = $request->input('fcm_token');

        $updateData = [];
        if ($full_name !== null) {
            $updateData['full_name'] = $full_name;
        }
        if ($phone !== null) {
            $updateData['phone'] = $phone;
        }
        if ($fcm_token !== null) {
            $updateData['fcm_token'] = $fcm_token;
        }

        if ($updateData === []) {
            return response()->json(['error' => 'At least one field (full_name, phone, or fcm_token) must be provided'], 400);
        }

        $r = SupabaseHttp::rest('PATCH', 'profiles', ['id' => 'eq.'.$user['id']], $updateData);

        if (! $r->successful()) {
            return response()->json(['error' => $r->body()], 400);
        }

        $rows = $r->json();
        $data = is_array($rows) && isset($rows[0]) ? $rows[0] : $rows;

        if (SupabaseHttp::serviceKey()) {
            try {
                $meta = array_merge($user['user_metadata'] ?? [], []);
                if ($full_name !== null) {
                    $meta['full_name'] = $full_name;
                }
                if ($phone !== null) {
                    $meta['phone'] = $phone;
                }
                Http::withHeaders([
                    'apikey' => SupabaseHttp::serviceKey(),
                    'Authorization' => 'Bearer '.SupabaseHttp::serviceKey(),
                    'Content-Type' => 'application/json',
                ])->patch(SupabaseHttp::base().'/auth/v1/admin/users/'.$user['id'], [
                    'user_metadata' => $meta,
                ]);
            } catch (\Throwable) {
                /* optional */
            }
        }

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'] ?? null,
                'full_name' => $data['full_name'] ?? null,
                'phone' => $data['phone'] ?? null,
            ],
        ]);
    }
}
