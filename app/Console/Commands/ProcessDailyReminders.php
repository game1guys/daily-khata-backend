<?php

namespace App\Console\Commands;

use App\Services\EmailDeliveryService;
use App\Services\FcmService;
use App\Services\Supabase\SupabaseHttp;
use Illuminate\Console\Command;
class ProcessDailyReminders extends Command
{
    protected $signature = 'khata:process-reminders';

    protected $description = 'Daily expense push + party udhar emails (matches legacy Node cron)';

    public function handle(): int
    {
        $this->info('Processing daily reminders...');

        $profiles = SupabaseHttp::rest('GET', 'profiles', [
            'select' => 'id,full_name,fcm_token',
        ]);

        if ($profiles->successful() && is_array($pr = $profiles->json())) {
            $tokens = [];
            foreach ($pr as $p) {
                if (! empty($p['fcm_token'])) {
                    $tokens[] = $p['fcm_token'];
                }
            }
            if ($tokens !== [] && FcmService::isReady()) {
                $r = FcmService::sendMulticast($tokens, 'Daily Khata', 'Ab apne expenses add karein.');
                $this->info("Push: success {$r['successCount']}, failed {$r['failureCount']}");
            }
        }

        $parties = SupabaseHttp::rest('GET', 'parties', [
            'select' => '*,udhar_transactions(*),profiles(full_name)',
            'reminder_frequency' => 'gt.0',
        ]);

        if (! $parties->successful() || ! is_array($partyRows = $parties->json())) {
            return self::SUCCESS;
        }

        $now = new \DateTimeImmutable;

        foreach ($partyRows as $party) {
            if (empty($party['email'])) {
                continue;
            }
            if (! empty($party['reminder_start_date'])) {
                $start = new \DateTimeImmutable($party['reminder_start_date']);
                if ($start > $now) {
                    continue;
                }
            }

            $balance = 0;
            foreach ($party['udhar_transactions'] ?? [] as $tx) {
                if (($tx['type'] ?? '') === 'given') {
                    $balance += (float) ($tx['amount'] ?? 0);
                } else {
                    $balance -= (float) ($tx['amount'] ?? 0);
                }
            }
            if ($balance <= 0) {
                continue;
            }

            $lastSent = ! empty($party['last_reminder_sent_at']) ? new \DateTimeImmutable($party['last_reminder_sent_at']) : null;
            $sentToday = (int) ($party['reminders_sent_today'] ?? 0);

            if ($lastSent && $lastSent->format('Y-m-d') !== $now->format('Y-m-d')) {
                $sentToday = 0;
                SupabaseHttp::rest('PATCH', 'parties', ['id' => 'eq.'.$party['id']], ['reminders_sent_today' => 0]);
            }

            $shouldSend = false;
            if (! $lastSent || $lastSent->format('Y-m-d') !== $now->format('Y-m-d')) {
                $shouldSend = true;
            } elseif ($sentToday < (int) ($party['reminder_frequency'] ?? 0)) {
                $hoursSinceLast = $lastSent ? ($now->getTimestamp() - $lastSent->getTimestamp()) / 3600 : 999;
                if ($hoursSinceLast >= 4) {
                    $shouldSend = true;
                }
            }

            if (! $shouldSend) {
                continue;
            }

            $prof = $party['profiles'] ?? null;
            $senderName = is_array($prof) ? ($prof['full_name'] ?? 'Daily-KHATA User') : 'Daily-KHATA User';

            $html = view('emails.reminder', [
                'partyName' => $party['name'] ?? '',
                'amount' => $balance,
                'senderName' => $senderName,
            ])->render();

            try {
                if (EmailDeliveryService::isConfigured()) {
                    EmailDeliveryService::sendHtml($party['email'], 'Payment Reminder - Daily-KHATA', $html);
                }
            } catch (\Throwable $e) {
                $this->error('Email failed: '.$e->getMessage());

                continue;
            }

            SupabaseHttp::rest('PATCH', 'parties', ['id' => 'eq.'.$party['id']], [
                'last_reminder_sent_at' => $now->format('c'),
                'reminders_sent_today' => $sentToday + 1,
            ]);
        }

        return self::SUCCESS;
    }
}
