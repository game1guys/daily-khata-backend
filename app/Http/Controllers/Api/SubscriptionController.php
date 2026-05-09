<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PromoService;
use App\Services\Supabase\SupabaseHttp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Razorpay\Api\Api;

class SubscriptionController extends Controller
{
    public function preview(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user')['id'] ?? null;
        if (! $userId) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $planType = (string) $request->input('planType');
        $promoCode = $request->input('promoCode');

        $resolved = PromoService::resolvePromoForUser($planType, is_string($promoCode) ? $promoCode : null, $userId);
        if (! $resolved['ok']) {
            return response()->json(['error' => $resolved['error'] ?? 'Invalid'], 400);
        }

        return response()->json([
            'amountPaise' => $resolved['amountPaise'],
            'originalPaise' => $resolved['originalPaise'],
            'percentOff' => $resolved['percentOff'],
            'currency' => 'INR',
        ]);
    }

    public function createOrder(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user')['id'] ?? null;
        if (! $userId) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $planType = (string) $request->input('planType');
        $promoCode = $request->input('promoCode');

        $resolved = PromoService::resolvePromoForUser($planType, is_string($promoCode) ? $promoCode : null, $userId);
        if (! $resolved['ok']) {
            return response()->json(['error' => $resolved['error'] ?? 'Invalid'], 400);
        }

        $keyId = config('services.razorpay.key_id');
        $keySecret = config('services.razorpay.key_secret');
        if (! $keyId || ! $keySecret) {
            return response()->json(['error' => 'Razorpay not configured'], 500);
        }

        $api = new Api($keyId, $keySecret);
        $notes = [
            'planType' => $planType,
            'userId' => (string) $userId,
        ];
        if (! empty($resolved['promoId'])) {
            $notes['promoId'] = (string) $resolved['promoId'];
        }

        try {
            $order = $api->order->create([
                'amount' => $resolved['amountPaise'],
                'currency' => 'INR',
                'receipt' => 'receipt_'.time(),
                'notes' => $notes,
            ]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }

        $payload = json_decode((string) json_encode($order), true);

        return response()->json($payload);
    }

    public function verifyPayment(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user')['id'] ?? null;
        if (! $userId) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $razorpay_order_id = $request->input('razorpay_order_id');
        $razorpay_payment_id = $request->input('razorpay_payment_id');
        $razorpay_signature = $request->input('razorpay_signature');
        $planType = (string) $request->input('planType');

        $keySecret = config('services.razorpay.key_secret');
        if (! $keySecret) {
            return response()->json(['error' => 'Razorpay not configured'], 500);
        }

        $expected = hash_hmac('sha256', $razorpay_order_id.'|'.$razorpay_payment_id, $keySecret);
        if ($expected !== $razorpay_signature) {
            return response()->json(['status' => 'failure', 'message' => 'Invalid signature'], 400);
        }

        $keyId = config('services.razorpay.key_id');
        $api = new Api($keyId, $keySecret);
        try {
            $order = $api->order->fetch($razorpay_order_id);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }

        $notes = $order['notes'] ?? [];
        if (! empty($notes['userId']) && $notes['userId'] !== (string) $userId) {
            return response()->json(['error' => 'Order does not belong to this user'], 400);
        }
        if (! empty($notes['planType']) && $notes['planType'] !== $planType) {
            return response()->json(['error' => 'Plan mismatch'], 400);
        }

        $endDate = new \DateTimeImmutable;
        if ($planType === 'premium_mon') {
            $endDate = $endDate->modify('+1 month');
        } elseif ($planType === 'premium_yr') {
            $endDate = $endDate->modify('+1 year');
        } elseif ($planType === 'premium_life') {
            $endDate = null;
        }

        $patch = [
            'subscription_tier' => $planType,
            'subscription_end_date' => $endDate ? $endDate->format('c') : null,
        ];

        $up = SupabaseHttp::rest('PATCH', 'profiles', ['id' => 'eq.'.$userId], $patch);
        if (! $up->successful()) {
            return response()->json(['error' => 'Failed to update subscription'], 500);
        }

        if (! empty($notes['promoId'])) {
            PromoService::recordPromoRedemption(
                (string) $notes['promoId'],
                $userId,
                $planType,
                (string) $razorpay_payment_id
            );
        }

        return response()->json(['status' => 'success', 'message' => 'Payment verified and subscription updated']);
    }
}
