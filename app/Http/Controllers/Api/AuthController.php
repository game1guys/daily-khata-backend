<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\EmailDeliveryService;
use App\Services\Supabase\SupabaseHttp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $email = $request->input('email');
        $password = $request->input('password');
        $full_name = $request->input('full_name');
        $phone = $request->input('phone');
        if (! $email || ! $password || ! $full_name) {
            return response()->json(['error' => 'Missing required fields'], 400);
        }

        $r = SupabaseHttp::authPost('signup', [
            'email' => $email,
            'password' => $password,
            'data' => [
                'full_name' => $full_name,
                'phone' => $phone,
            ],
        ]);

        if (! $r->successful()) {
            return response()->json(['error' => $r->json('msg') ?? $r->json('error_description') ?? $r->body()], 400);
        }

        return response()->json([
            'message' => 'User registered successfully',
            'data' => $r->json(),
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $email = $request->input('email');
        $password = $request->input('password');
        if (! $email || ! $password) {
            return response()->json(['error' => 'Missing email or password'], 400);
        }

        $r = Http::withHeaders([
            'apikey' => SupabaseHttp::serviceKey(),
            'Authorization' => 'Bearer '.SupabaseHttp::serviceKey(),
            'Content-Type' => 'application/json',
        ])->post(SupabaseHttp::base().'/auth/v1/token?grant_type=password', [
            'email' => $email,
            'password' => $password,
        ]);

        if (! $r->successful()) {
            return response()->json(['error' => $r->json('error_description') ?? $r->json('msg') ?? 'Login failed'], 401);
        }

        $session = $r->json();
        $userId = $session['user']['id'] ?? null;
        $profile = ['subscription_tier' => 'free'];
        if ($userId) {
            $pr = SupabaseHttp::rest('GET', 'profiles', [
                'select' => 'full_name,phone,subscription_tier,subscription_end_date',
                'id' => 'eq.'.$userId,
                'limit' => 1,
            ]);
            if ($pr->successful() && is_array($pr->json()) && count($pr->json()) > 0) {
                $profile = $pr->json()[0];
            }
        }

        return response()->json([
            'message' => 'Login successful',
            'session' => $session,
            'profile' => $profile,
        ]);
    }

    public function google(Request $request): JsonResponse
    {
        $id_token = $request->input('id_token');
        if (! $id_token) {
            return response()->json(['error' => 'Missing native Google id_token from device payload'], 400);
        }

        $r = Http::withHeaders([
            'apikey' => SupabaseHttp::serviceKey(),
            'Authorization' => 'Bearer '.SupabaseHttp::serviceKey(),
            'Content-Type' => 'application/json',
        ])->post(SupabaseHttp::base().'/auth/v1/token?grant_type=id_token', [
            'provider' => 'google',
            'id_token' => $id_token,
        ]);

        if (! $r->successful()) {
            return response()->json(['error' => $r->json('error_description') ?? $r->body()], 401);
        }

        $session = $r->json();
        $userId = $session['user']['id'] ?? null;
        $profile = ['subscription_tier' => 'free'];
        if ($userId) {
            $pr = SupabaseHttp::rest('GET', 'profiles', [
                'select' => 'full_name,phone,subscription_tier,subscription_end_date',
                'id' => 'eq.'.$userId,
                'limit' => 1,
            ]);
            if ($pr->successful() && is_array($pr->json()) && count($pr->json()) > 0) {
                $profile = $pr->json()[0];
            }
        }

        return response()->json([
            'message' => 'Google login successful',
            'session' => $session,
            'profile' => $profile,
        ]);
    }

    public function sendForgotPasswordOtp(Request $request): JsonResponse
    {
        $emailRaw = strtolower(trim((string) $request->input('email', '')));
        if (! $emailRaw || ! filter_var($emailRaw, FILTER_VALIDATE_EMAIL)) {
            return response()->json(['error' => 'Valid email is required'], 400);
        }

        if (! EmailDeliveryService::isConfigured()) {
            return response()->json([
                'error' => 'Email service is not configured. Set RESEND_API_KEY or SMTP (MAIL_*).',
            ], 503);
        }

        $generic = [
            'message' => 'If an account exists for this email, you will receive an OTP shortly.',
        ];

        $url = SupabaseHttp::base().'/auth/v1/admin/generate_link';
        $r = Http::timeout(60)->withHeaders([
            'apikey' => SupabaseHttp::serviceKey(),
            'Authorization' => 'Bearer '.SupabaseHttp::serviceKey(),
            'Content-Type' => 'application/json',
        ])->post($url, [
            'type' => 'recovery',
            'email' => $emailRaw,
        ]);

        if (! $r->successful()) {
            \Log::warning('generateLink recovery', ['body' => $r->body()]);

            return response()->json($generic);
        }

        $body = $r->json();
        $userId = $body['user']['id'] ?? null;
        $otp = $body['properties']['email_otp'] ?? null;
        if (! $userId || ! $otp) {
            return response()->json($generic);
        }

        Cache::put('forgot_otp:'.$emailRaw, ['otp' => (string) $otp, 'user_id' => $userId], now()->addMinutes(15));

        try {
            $html = view('emails.otp', ['otp' => $otp])->render();
            EmailDeliveryService::sendHtml($emailRaw, 'Your Daily-KHATA password reset code', $html);
        } catch (\Throwable $e) {
            Cache::forget('forgot_otp:'.$emailRaw);
            \Log::error('sendForgotPasswordOtp', ['e' => $e->getMessage()]);

            return response()->json(['error' => 'Could not send OTP email. Please try again.'], 503);
        }

        return response()->json($generic);
    }

    public function resetPasswordWithOtp(Request $request): JsonResponse
    {
        $emailRaw = strtolower(trim((string) $request->input('email', '')));
        $otp = trim((string) $request->input('otp', ''));
        $newPassword = $request->input('newPassword');

        if (! $emailRaw || ! $otp || ! is_string($newPassword) || $newPassword === '') {
            return response()->json(['error' => 'Email, OTP, and new password are required'], 400);
        }
        if (strlen($newPassword) < 8) {
            return response()->json(['error' => 'Password must be at least 8 characters'], 400);
        }
        if (! preg_match('/^\d{6,12}$/', $otp)) {
            return response()->json(['error' => 'Enter the OTP from your email (digits only).'], 400);
        }

        $row = Cache::get('forgot_otp:'.$emailRaw);
        if (! $row || ($row['otp'] ?? '') !== $otp) {
            Cache::forget('forgot_otp:'.$emailRaw);

            return response()->json(['error' => 'Invalid or expired OTP. Request a new one.'], 400);
        }

        $userId = $row['user_id'];
        $url = SupabaseHttp::base().'/auth/v1/admin/users/'.$userId;
        $r = Http::withHeaders([
            'apikey' => SupabaseHttp::serviceKey(),
            'Authorization' => 'Bearer '.SupabaseHttp::serviceKey(),
            'Content-Type' => 'application/json',
        ])->patch($url, ['password' => $newPassword]);

        Cache::forget('forgot_otp:'.$emailRaw);

        if (! $r->successful()) {
            return response()->json(['error' => $r->json('msg') ?? $r->body()], 400);
        }

        return response()->json(['message' => 'Password updated. You can sign in now.']);
    }
}
