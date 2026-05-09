<?php

namespace App\Services;

use App\Services\Supabase\SupabaseHttp;

class PromoService
{
    private const PLAN_AMOUNTS_PAISE = [
        'premium_mon' => 2900,
        'premium_yr' => 19900,
        'premium_life' => 69900,
    ];

    public static function baseAmountPaise(string $planType): ?int
    {
        return self::PLAN_AMOUNTS_PAISE[$planType] ?? null;
    }

    /**
     * @return array{ok: bool, amountPaise?: int, originalPaise?: int, percentOff?: int, promoId?: string|null, error?: string}
     */
    public static function resolvePromoForUser(string $planType, ?string $promoCode, string $userId): array
    {
        $originalPaise = self::baseAmountPaise($planType);
        if ($originalPaise === null) {
            return ['ok' => false, 'error' => 'Invalid plan type'];
        }

        $trimmed = $promoCode !== null ? trim($promoCode) : '';
        if ($trimmed === '') {
            return ['ok' => true, 'amountPaise' => $originalPaise, 'originalPaise' => $originalPaise, 'percentOff' => 0, 'promoId' => null];
        }

        $normalized = strtoupper($trimmed);
        $r = SupabaseHttp::rest('GET', 'promo_codes', [
            'select' => 'id,percent_off,max_uses,used_count,expires_at,is_active',
            'code' => 'eq.'.$normalized,
            'limit' => 1,
        ]);

        if (! $r->successful() || ! is_array($r->json()) || count($r->json()) === 0) {
            return ['ok' => false, 'error' => 'Invalid promo code'];
        }

        $promo = $r->json()[0];
        if (! ($promo['is_active'] ?? false)) {
            return ['ok' => false, 'error' => 'This promo code is inactive'];
        }
        if (! empty($promo['expires_at']) && strtotime($promo['expires_at']) < time()) {
            return ['ok' => false, 'error' => 'This promo code has expired'];
        }
        if (isset($promo['max_uses']) && $promo['max_uses'] !== null && (int) $promo['used_count'] >= (int) $promo['max_uses']) {
            return ['ok' => false, 'error' => 'This promo code is no longer available'];
        }

        $prior = SupabaseHttp::rest('GET', 'promo_redemptions', [
            'select' => 'id',
            'promo_id' => 'eq.'.$promo['id'],
            'user_id' => 'eq.'.$userId,
            'limit' => 1,
        ]);
        if ($prior->successful() && is_array($prior->json()) && count($prior->json()) > 0) {
            return ['ok' => false, 'error' => 'You have already used this promo code'];
        }

        $percentOff = (int) $promo['percent_off'];
        $discounted = (int) round(($originalPaise * (100 - $percentOff)) / 100);
        $amountPaise = max(100, $discounted);

        return [
            'ok' => true,
            'amountPaise' => $amountPaise,
            'originalPaise' => $originalPaise,
            'percentOff' => $percentOff,
            'promoId' => $promo['id'],
        ];
    }

    public static function recordPromoRedemption(string $promoId, string $userId, string $planType, string $razorpayPaymentId): array
    {
        $existing = SupabaseHttp::rest('GET', 'promo_redemptions', [
            'select' => 'id',
            'razorpay_payment_id' => 'eq.'.$razorpayPaymentId,
            'limit' => 1,
        ]);
        if ($existing->successful() && is_array($existing->json()) && count($existing->json()) > 0) {
            return ['ok' => true];
        }

        $ins = SupabaseHttp::rest('POST', 'promo_redemptions', [], [[
            'promo_id' => $promoId,
            'user_id' => $userId,
            'plan_type' => $planType,
            'razorpay_payment_id' => $razorpayPaymentId,
        ]]);

        if (! $ins->successful()) {
            $body = $ins->body();
            if (str_contains(strtolower($body), 'duplicate') || str_contains($body, '23505')) {
                return ['ok' => true];
            }

            return ['ok' => false, 'error' => $body];
        }

        $row = SupabaseHttp::rest('GET', 'promo_codes', [
            'select' => 'used_count',
            'id' => 'eq.'.$promoId,
            'limit' => 1,
        ]);
        $next = 1;
        if ($row->successful() && is_array($row->json()) && isset($row->json()[0])) {
            $next = (int) ($row->json()[0]['used_count'] ?? 0) + 1;
        }
        SupabaseHttp::rest('PATCH', 'promo_codes', ['id' => 'eq.'.$promoId], ['used_count' => $next]);

        return ['ok' => true];
    }
}
