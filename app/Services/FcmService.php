<?php

namespace App\Services;

use Kreait\Firebase\Factory;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification;

class FcmService
{
    private static ?\Kreait\Firebase\Messaging $messaging = null;

    private static function messaging(): ?\Kreait\Firebase\Messaging
    {
        if (self::$messaging !== null) {
            return self::$messaging;
        }
        $json = self::loadCredentialJson();
        if ($json === null) {
            return null;
        }
        try {
            $factory = (new Factory)->withServiceAccount($json);
            self::$messaging = $factory->createMessaging();

            return self::$messaging;
        } catch (\Throwable $e) {
            \Log::warning('FCM init failed', ['e' => $e->getMessage()]);

            return null;
        }
    }

    private static function loadCredentialJson(): ?array
    {
        $path = env('FIREBASE_SERVICE_ACCOUNT_PATH');
        if ($path && is_readable($path)) {
            $raw = file_get_contents($path);

            return $raw ? json_decode($raw, true) : null;
        }
        $b64 = env('FIREBASE_SERVICE_ACCOUNT_B64');
        if ($b64) {
            $raw = base64_decode($b64, true);

            return $raw ? json_decode($raw, true) : null;
        }
        $raw = env('FIREBASE_SERVICE_ACCOUNT_JSON');
        if ($raw) {
            return json_decode($raw, true);
        }

        return null;
    }

    public static function isReady(): bool
    {
        return self::messaging() !== null;
    }

    public static function tierMatchesSubscription(?string $subscriptionTier, string $targetTier): bool
    {
        $t = trim($subscriptionTier ?: 'free');
        switch (trim($targetTier)) {
            case 'all':
                return true;
            case 'free':
                return $t === 'free';
            case 'premium':
                return $t !== 'free' && str_starts_with($t, 'premium');
            case 'premium_mon':
                return $t === 'premium_mon';
            case 'premium_yr':
                return $t === 'premium_yr';
            case 'premium_life':
                return $t === 'premium_life';
            default:
                return false;
        }
    }

    /**
     * @param  array<int, string>  $tokens
     * @param  array<string, string>  $data
     * @return array{successCount: int, failureCount: int}
     */
    public static function sendMulticast(array $tokens, string $title, string $body, ?string $imageUrl = null, array $data = []): array
    {
        $m = self::messaging();
        $unique = array_values(array_unique(array_filter($tokens)));
        if (! $m || $unique === []) {
            return ['successCount' => 0, 'failureCount' => 0];
        }

        $successCount = 0;
        $failureCount = 0;
        $chunks = array_chunk($unique, 500);

        foreach ($chunks as $batch) {
            $message = CloudMessage::new()
                ->withNotification(Notification::create($title, $body));
            if ($data !== []) {
                $message = $message->withData(array_map('strval', $data));
            }
            try {
                $report = $m->sendMulticast($message, $batch);
                $successCount += $report->successes()->count();
                $failureCount += $report->failures()->count();
            } catch (\Throwable $e) {
                \Log::warning('FCM multicast chunk failed', ['e' => $e->getMessage()]);
                $failureCount += count($batch);
            }
        }

        return ['successCount' => $successCount, 'failureCount' => $failureCount];
    }
}
