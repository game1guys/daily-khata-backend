<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

/**
 * Resend (HTTPS) + optional SMTP — mirrors legacy Node email.service.ts
 */
class EmailDeliveryService
{
    public static function isConfigured(): bool
    {
        if (config('services.resend.key')) {
            return true;
        }

        return (bool) (config('mail.mailers.smtp.username') && config('mail.mailers.smtp.password'));
    }

    public static function isResend(): bool
    {
        return (bool) config('services.resend.key');
    }

    public static function sendHtml(string $to, string $subject, string $html): void
    {
        if (self::isResend()) {
            self::sendViaResend($to, $subject, $html);

            return;
        }

        \Illuminate\Support\Facades\Mail::html($html, function ($message) use ($to, $subject) {
            $message->to($to)->subject($subject);
        });
    }

    protected static function sendViaResend(string $to, string $subject, string $html): void
    {
        $key = config('services.resend.key');
        $from = config('services.resend.from') ?: 'Daily-KHATA <onboarding@resend.dev>';

        $res = Http::withHeaders([
            'Authorization' => 'Bearer '.$key,
            'Content-Type' => 'application/json',
        ])->post('https://api.resend.com/emails', [
            'from' => $from,
            'to' => [$to],
            'subject' => $subject,
            'html' => $html,
        ]);

        if (! $res->successful()) {
            throw new \RuntimeException('Resend API '.$res->status().': '.$res->body());
        }
    }
}
