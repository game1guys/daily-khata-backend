<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\EmailDeliveryService;
use App\Services\Supabase\SupabaseHttp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PartyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user')['id'] ?? null;
        $r = SupabaseHttp::rest('GET', 'parties', [
            'select' => '*,udhar_transactions(*)',
            'user_id' => 'eq.'.$userId,
        ]);
        if (! $r->successful()) {
            return response()->json(['error' => $r->body()], 400);
        }

        return response()->json(['parties' => $r->json()]);
    }

    public function store(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user')['id'] ?? null;
        $name = $request->input('name');
        if (! $name) {
            return response()->json(['error' => 'Party name is required'], 400);
        }

        $row = [
            'user_id' => $userId,
            'name' => $name,
            'phone' => $request->input('phone'),
            'email' => $request->input('email'),
            'reminder_frequency' => $request->input('reminder_frequency') ?? 0,
            'reminder_start_date' => $request->input('reminder_start_date'),
        ];

        $r = SupabaseHttp::rest('POST', 'parties', [], [$row]);
        if (! $r->successful()) {
            return response()->json(['error' => $r->body()], 400);
        }

        $data = $r->json();

        return response()->json(['party' => is_array($data) && isset($data[0]) ? $data[0] : $data], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user')['id'] ?? null;
        $patch = [
            'name' => $request->input('name'),
            'phone' => $request->input('phone'),
            'email' => $request->input('email'),
            'reminder_frequency' => $request->input('reminder_frequency'),
            'reminder_start_date' => $request->input('reminder_start_date'),
        ];

        $r = SupabaseHttp::rest('PATCH', 'parties', [
            'id' => 'eq.'.$id,
            'user_id' => 'eq.'.$userId,
        ], $patch);
        if (! $r->successful()) {
            return response()->json(['error' => $r->body()], 400);
        }

        $data = $r->json();

        return response()->json(['party' => is_array($data) && isset($data[0]) ? $data[0] : $data]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user')['id'] ?? null;
        $r = SupabaseHttp::rest('DELETE', 'parties', [
            'id' => 'eq.'.$id,
            'user_id' => 'eq.'.$userId,
        ]);
        if (! $r->successful()) {
            return response()->json(['error' => $r->body()], 400);
        }

        return response()->json(['message' => 'Party deleted successfully']);
    }

    public function triggerReminder(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user')['id'] ?? null;
        $partyId = $request->input('partyId');

        $partyR = SupabaseHttp::rest('GET', 'parties', [
            'select' => '*,udhar_transactions(*)',
            'id' => 'eq.'.$partyId,
            'user_id' => 'eq.'.$userId,
            'limit' => 1,
        ]);
        if (! $partyR->successful() || ! is_array($partyR->json()) || count($partyR->json()) === 0) {
            return response()->json(['error' => 'Party not found'], 404);
        }

        $party = $partyR->json()[0];
        if (empty($party['email'])) {
            return response()->json(['error' => 'Party email is missing'], 400);
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
            return response()->json(['error' => 'No outstanding balance found'], 400);
        }

        $prof = SupabaseHttp::rest('GET', 'profiles', [
            'select' => 'full_name',
            'id' => 'eq.'.$userId,
            'limit' => 1,
        ]);
        $senderName = 'Daily-KHATA User';
        if ($prof->successful() && is_array($prof->json()) && isset($prof->json()[0])) {
            $senderName = $prof->json()[0]['full_name'] ?? $senderName;
        }

        $html = view('emails.reminder', [
            'partyName' => $party['name'] ?? '',
            'amount' => $balance,
            'senderName' => $senderName,
        ])->render();

        try {
            EmailDeliveryService::sendHtml($party['email'], 'Payment Reminder - Daily-KHATA', $html);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }

        SupabaseHttp::rest('PATCH', 'parties', ['id' => 'eq.'.$partyId], [
            'last_reminder_sent_at' => date('c'),
            'reminders_sent_today' => (int) (($party['reminders_sent_today'] ?? 0) + 1),
        ]);

        return response()->json(['message' => 'Reminder email sent successfully']);
    }

    public function addUdhar(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user')['id'] ?? null;
        $party_id = $request->input('party_id');
        $amount = $request->input('amount');
        $type = $request->input('type');
        if (! $party_id || ! $amount || ! $type) {
            return response()->json(['error' => 'Party ID, amount, and type are required'], 400);
        }

        $row = [
            'party_id' => $party_id,
            'user_id' => $userId,
            'amount' => $amount,
            'type' => $type,
            'note' => $request->input('note'),
            'transaction_date' => $request->input('transaction_date') ?: date('c'),
        ];

        $r = SupabaseHttp::rest('POST', 'udhar_transactions', [], [$row]);
        if (! $r->successful()) {
            return response()->json(['error' => $r->body()], 400);
        }

        $data = $r->json();

        return response()->json(['udhar_transaction' => is_array($data) && isset($data[0]) ? $data[0] : $data], 201);
    }
}
