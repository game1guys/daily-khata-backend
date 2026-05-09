<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\EmailDeliveryService;
use App\Services\FcmService;
use App\Services\Supabase\SupabaseHttp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AdminController extends Controller
{
    public function createUser(Request $request): JsonResponse
    {
        $email = $request->input('email');
        $full_name = $request->input('full_name');
        if (! $email || ! $full_name) {
            return response()->json(['error' => 'System Exception: Email and Full Name are mathematically mandatory.'], 400);
        }

        $finalPassword = $request->input('password') ?: (substr(bin2hex(random_bytes(6)), 0, 8).'Xk9#');

        $url = SupabaseHttp::base().'/auth/v1/admin/users';
        $r = Http::withHeaders([
            'apikey' => SupabaseHttp::serviceKey(),
            'Authorization' => 'Bearer '.SupabaseHttp::serviceKey(),
            'Content-Type' => 'application/json',
        ])->post($url, [
            'email' => $email,
            'password' => $finalPassword,
            'email_confirm' => true,
            'user_metadata' => ['full_name' => $full_name],
        ]);

        if (! $r->successful()) {
            return response()->json(['error' => 'Auth Engine Blocked User Generation.', 'details' => $r->json()], 500);
        }

        $authData = $r->json();
        $userId = $authData['id'] ?? null;
        if (! $userId) {
            return response()->json(['error' => 'Auth Engine Blocked User Generation.'], 500);
        }

        $subscription_tier = $request->input('subscription_tier');
        if ($subscription_tier && $subscription_tier !== 'free') {
            SupabaseHttp::rest('PATCH', 'profiles', ['id' => 'eq.'.$userId], ['subscription_tier' => $subscription_tier]);
        }

        if (EmailDeliveryService::isConfigured()) {
            $html = view('emails.admin_welcome', compact('full_name', 'email', 'finalPassword'))->render();
            try {
                EmailDeliveryService::sendHtml($email, 'Initialization: Your Secure Network Node Instructions', $html);
            } catch (\Throwable $e) {
                \Log::warning('Admin welcome email failed', ['e' => $e->getMessage()]);
            }
        }

        return response()->json([
            'message' => 'Network Node provisioned & secure transmission executed successfully.',
            'user_id' => $userId,
        ], 201);
    }

    public function coreData(Request $request): JsonResponse
    {
        try {
            $u = SupabaseHttp::rest('GET', 'profiles', ['select' => 'subscription_tier']);
            $c = SupabaseHttp::rest('GET', 'categories', [
                'select' => '*',
                'user_id' => 'is.null',
            ]);
            if (! $u->successful()) {
                throw new \RuntimeException($u->body());
            }

            $matrix = $u->json() ?: [];
            $cats = $c->successful() ? ($c->json() ?: []) : [];

            return response()->json([
                'stats' => [
                    'totalUsers' => count($matrix),
                    'activeSubscriptions' => count(array_filter($matrix, fn ($x) => ($x['subscription_tier'] ?? 'free') !== 'free')),
                ],
                'categories' => $cats,
            ]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function usersPaginated(Request $request): JsonResponse
    {
        try {
            $page = max(1, (int) $request->query('page', 1));
            $limit = max(1, (int) $request->query('limit', 10));
            $offset = ($page - 1) * $limit;

            $url = SupabaseHttp::base().'/rest/v1/profiles?'.http_build_query([
                'select' => '*',
                'order' => 'created_at.desc',
            ], '', '&', PHP_QUERY_RFC3986);

            $r = Http::withHeaders(array_merge(SupabaseHttp::serviceHeaders(), [
                'Range' => $offset.'-'.($offset + $limit - 1),
                'Prefer' => 'count=exact',
            ]))->get($url);

            if (! $r->successful()) {
                throw new \RuntimeException($r->body());
            }

            $total = null;
            if (preg_match('/\/(\d+)$/', (string) $r->header('Content-Range'), $m)) {
                $total = (int) $m[1];
            }

            return response()->json([
                'users' => $r->json() ?: [],
                'total' => $total ?? 0,
                'totalPages' => $limit > 0 ? (int) ceil(($total ?? 0) / $limit) : 0,
                'currentPage' => $page,
            ]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function notificationsPaginated(Request $request): JsonResponse
    {
        try {
            $page = max(1, (int) $request->query('page', 1));
            $limit = max(1, (int) $request->query('limit', 10));
            $offset = ($page - 1) * $limit;

            $url = SupabaseHttp::base().'/rest/v1/notifications?'.http_build_query([
                'select' => '*',
                'order' => 'created_at.desc',
            ], '', '&', PHP_QUERY_RFC3986);

            $r = Http::withHeaders(array_merge(SupabaseHttp::serviceHeaders(), [
                'Range' => $offset.'-'.($offset + $limit - 1),
                'Prefer' => 'count=exact',
            ]))->get($url);

            if (! $r->successful()) {
                throw new \RuntimeException($r->body());
            }

            $total = null;
            if (preg_match('/\/(\d+)$/', (string) $r->header('Content-Range'), $m)) {
                $total = (int) $m[1];
            }

            return response()->json([
                'notifications' => $r->json() ?: [],
                'total' => $total ?? 0,
                'totalPages' => $limit > 0 ? (int) ceil(($total ?? 0) / $limit) : 0,
                'currentPage' => $page,
            ]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function broadcastNotification(Request $request): JsonResponse
    {
        try {
            $title = $request->input('title');
            $message = $request->input('message');
            $target_tier = $request->input('target_tier');
            $image_url = $request->input('image_url');
            if (! $title || ! $message || ! $target_tier) {
                return response()->json(['error' => 'title, message, and target_tier are required'], 400);
            }

            $ins = SupabaseHttp::rest('POST', 'notifications', [], [[
                'title' => trim((string) $title),
                'message' => trim((string) $message),
                'target_tier' => trim((string) $target_tier),
                'image_url' => $image_url ? trim((string) $image_url) : null,
            ]]);
            if (! $ins->successful()) {
                throw new \RuntimeException($ins->body());
            }
            $row = $ins->json();
            $row = is_array($row) && isset($row[0]) ? $row[0] : $row;

            $prof = SupabaseHttp::rest('GET', 'profiles', [
                'select' => 'fcm_token,subscription_tier',
            ]);
            if (! $prof->successful()) {
                throw new \RuntimeException($prof->body());
            }

            $profiles = $prof->json() ?: [];
            $tokens = [];
            foreach ($profiles as $p) {
                if (empty($p['fcm_token'])) {
                    continue;
                }
                if (FcmService::tierMatchesSubscription($p['subscription_tier'] ?? null, (string) $target_tier)) {
                    $tokens[] = $p['fcm_token'];
                }
            }

            $push = ['successCount' => 0, 'failureCount' => 0];
            $fcmOk = FcmService::isReady();
            if ($fcmOk && $tokens !== []) {
                $img = $row['image_url'] ?? null;
                $imageUrl = $img && (str_starts_with($img, 'http://') || str_starts_with($img, 'https://')) ? $img : null;
                $push = FcmService::sendMulticast(
                    $tokens,
                    (string) $row['title'],
                    (string) $row['message'],
                    $imageUrl ?? null,
                    [
                        'type' => 'admin_broadcast',
                        'notification_id' => (string) ($row['id'] ?? ''),
                    ]
                );
            }

            return response()->json([
                'notification' => $row,
                'target_tier' => $target_tier,
                'eligible_devices' => count($tokens),
                'fcm_configured' => $fcmOk,
                'push' => $push,
            ], 201);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function userLedger(Request $request, string $targetUserId): JsonResponse
    {
        try {
            $r = SupabaseHttp::rest('GET', 'transactions', [
                'select' => '*,categories(name)',
                'user_id' => 'eq.'.$targetUserId,
                'order' => 'transaction_date.desc',
            ]);
            if (! $r->successful()) {
                throw new \RuntimeException($r->body());
            }

            return response()->json(['ledger' => $r->json() ?: []]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function pulseLeaders(Request $request): JsonResponse
    {
        try {
            $r = SupabaseHttp::rest('GET', 'transactions', [
                'select' => 'amount,type,user_id,profiles(full_name)',
            ]);
            if (! $r->successful() || ! is_array($logs = $r->json())) {
                return response()->json(['error' => 'Failed to access structural logs.'], 500);
            }

            $usersIndex = [];
            foreach ($logs as $trx) {
                $uid = $trx['user_id'] ?? null;
                if (! $uid) {
                    continue;
                }
                $p = $trx['profiles'] ?? null;
                $name = is_array($p) ? ($p['full_name'] ?? 'Anonymous Node') : 'Anonymous Node';
                if (! isset($usersIndex[$uid])) {
                    $usersIndex[$uid] = ['name' => $name, 'expense' => 0.0, 'income' => 0.0];
                }
                $val = (float) ($trx['amount'] ?? 0);
                if (($trx['type'] ?? '') === 'expense') {
                    $usersIndex[$uid]['expense'] += $val;
                } elseif (($trx['type'] ?? '') === 'income') {
                    $usersIndex[$uid]['income'] += $val;
                }
            }

            $leaderArray = array_values($usersIndex);
            $forSpend = $leaderArray;
            usort($forSpend, fn ($a, $b) => $b['expense'] <=> $a['expense']);
            $topSpenders = array_values(array_filter(array_slice($forSpend, 0, 5), fn ($x) => $x['expense'] > 0));
            $forIncome = $leaderArray;
            usort($forIncome, fn ($a, $b) => $b['income'] <=> $a['income']);
            $topEarners = array_values(array_filter(array_slice($forIncome, 0, 5), fn ($x) => $x['income'] > 0));

            return response()->json(['topSpenders' => $topSpenders, 'topEarners' => $topEarners]);
        } catch (\Throwable $e) {
            return response()->json(['error' => 'System Pulse Aggregation failure.'], 500);
        }
    }

    public function listPromoCodes(Request $request): JsonResponse
    {
        try {
            $r = SupabaseHttp::rest('GET', 'promo_codes', [
                'select' => '*',
                'order' => 'created_at.desc',
            ]);
            if (! $r->successful()) {
                throw new \RuntimeException($r->body());
            }

            return response()->json(['promos' => $r->json() ?: []]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function createPromoCode(Request $request): JsonResponse
    {
        try {
            $code = $request->input('code');
            $percent_off = $request->input('percent_off');
            if (! $code || $percent_off === null) {
                return response()->json(['error' => 'code and percent_off are required'], 400);
            }
            $pct = (float) $percent_off;
            if ($pct < 1 || $pct > 100) {
                return response()->json(['error' => 'percent_off must be between 1 and 100'], 400);
            }

            $row = [
                'code' => strtoupper(trim((string) $code)),
                'percent_off' => $pct,
                'max_uses' => $request->has('max_uses') && $request->input('max_uses') !== '' && $request->input('max_uses') !== null
                    ? (int) $request->input('max_uses') : null,
                'expires_at' => $request->input('expires_at') ? date('c', strtotime((string) $request->input('expires_at'))) : null,
                'is_active' => true,
            ];

            $r = SupabaseHttp::rest('POST', 'promo_codes', [], [$row]);
            if (! $r->successful()) {
                throw new \RuntimeException($r->body());
            }
            $data = $r->json();

            return response()->json(['promo' => is_array($data) && isset($data[0]) ? $data[0] : $data], 201);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updatePromoCode(Request $request, string $id): JsonResponse
    {
        try {
            $patch = [];
            if ($request->has('is_active')) {
                $patch['is_active'] = (bool) $request->input('is_active');
            }
            if ($request->has('max_uses')) {
                $patch['max_uses'] = $request->input('max_uses') === null ? null : (int) $request->input('max_uses');
            }
            if ($request->has('expires_at')) {
                $patch['expires_at'] = $request->input('expires_at') ? date('c', strtotime((string) $request->input('expires_at'))) : null;
            }

            $r = SupabaseHttp::rest('PATCH', 'promo_codes', ['id' => 'eq.'.$id], $patch);
            if (! $r->successful()) {
                throw new \RuntimeException($r->body());
            }
            $data = $r->json();

            return response()->json(['promo' => is_array($data) && isset($data[0]) ? $data[0] : $data]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
