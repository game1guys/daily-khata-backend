<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\StorageService;
use App\Services\Supabase\SupabaseHttp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TransactionController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user')['id'] ?? null;
        $amount = $request->input('amount');
        $category_id = $request->input('category_id');
        $type = $request->input('type');
        if (! $amount || ! $type || ! $category_id) {
            return response()->json(['error' => 'Amount, type, and category_id are mathematically required.'], 400);
        }

        $receipt_url = $request->input('receipt_url');
        if ($request->hasFile('invoice')) {
            try {
                $receipt_url = StorageService::uploadFile('invoices', (string) $userId, $request->file('invoice'));
            } catch (\Throwable $e) {
                \Log::warning('Invoice upload failed', ['e' => $e->getMessage()]);
            }
        }

        $cat = SupabaseHttp::rest('GET', 'categories', [
            'select' => 'type',
            'id' => 'eq.'.$category_id,
            'limit' => 1,
        ]);
        if (! $cat->successful() || ! is_array($cat->json()) || count($cat->json()) === 0) {
            return response()->json(['error' => 'Invalid category selected.'], 400);
        }
        $category = $cat->json()[0];
        if (($category['type'] ?? '') !== $type) {
            return response()->json(['error' => "Category type ({$category['type']}) does not match transaction type ({$type})."], 400);
        }

        $prof = SupabaseHttp::rest('GET', 'profiles', [
            'select' => 'subscription_tier',
            'id' => 'eq.'.$userId,
            'limit' => 1,
        ]);
        $tier = 'free';
        if ($prof->successful() && is_array($prof->json()) && isset($prof->json()[0])) {
            $tier = $prof->json()[0]['subscription_tier'] ?? 'free';
        }

        if ($tier === 'free') {
            $startOfMonth = date('Y-m-01');
            $txList = SupabaseHttp::rest('GET', 'transactions', [
                'select' => 'id',
                'user_id' => 'eq.'.$userId,
                'transaction_date' => 'gte.'.$startOfMonth,
            ]);
            if ($txList->successful() && is_array($txList->json()) && count($txList->json()) >= 100) {
                return response()->json(['error' => 'Monthly transaction limit (100) reached for Free Plan. Please upgrade to Premium.'], 403);
            }

            $party_id = $request->input('party_id');
            $party_name = $request->input('party_name');
            if (! $party_id && $party_name) {
                $pc = SupabaseHttp::rest('GET', 'parties', [
                    'select' => 'id',
                    'user_id' => 'eq.'.$userId,
                ]);
                if ($pc->successful() && is_array($pc->json()) && count($pc->json()) >= 3) {
                    return response()->json(['error' => 'Party limit (3) reached for Free Plan. Please upgrade to Premium.'], 403);
                }
            }
        }

        $resolvedPartyId = $request->input('party_id');
        $party_name = $request->input('party_name');
        if (! $resolvedPartyId && $party_name) {
            $ins = SupabaseHttp::rest('POST', 'parties', [], [[
                'user_id' => $userId,
                'name' => $party_name,
            ]]);
            if ($ins->successful() && is_array($ins->json()) && isset($ins->json()[0])) {
                $resolvedPartyId = $ins->json()[0]['id'];
            }
        }

        $row = [
            'user_id' => $userId,
            'amount' => (float) $amount,
            'category_id' => $category_id,
            'party_id' => $resolvedPartyId ?: null,
            'type' => $type,
            'note' => $request->input('note'),
            'transaction_date' => $request->input('transaction_date') ?: date('c'),
            'receipt_url' => $receipt_url,
        ];

        $r = SupabaseHttp::rest('POST', 'transactions', [], [$row]);
        if (! $r->successful()) {
            return response()->json(['error' => $r->body()], 400);
        }

        $data = $r->json();
        $tx = is_array($data) && isset($data[0]) ? $data[0] : $data;

        if ($request->input('udhar_type') && $resolvedPartyId) {
            SupabaseHttp::rest('PATCH', 'parties', ['id' => 'eq.'.$resolvedPartyId], ['reminders_sent_today' => 0]);
        }

        return response()->json(['transaction' => $tx], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user')['id'] ?? null;
        $page = max(1, (int) $request->query('page', 1));
        $limit = max(1, (int) $request->query('limit', 20));
        $offset = ($page - 1) * $limit;

        $r = Http::withHeaders(array_merge(SupabaseHttp::serviceHeaders(), [
            'Range' => $offset.'-'.($offset + $limit - 1),
            'Prefer' => 'count=exact',
        ]))->get(SupabaseHttp::base().'/rest/v1/transactions', [
            'select' => '*,categories(*),parties(*)',
            'user_id' => 'eq.'.$userId,
            'order' => 'transaction_date.desc',
        ]);

        if (! $r->successful()) {
            return response()->json(['error' => $r->body()], 400);
        }

        $total = null;
        $cr = $r->header('Content-Range');
        if ($cr && preg_match('/\/(\d+)$/', $cr, $m)) {
            $total = (int) $m[1];
        }

        return response()->json([
            'transactions' => $r->json(),
            'total' => $total ?? 0,
            'totalPages' => $limit > 0 ? (int) ceil(($total ?? 0) / $limit) : 0,
            'currentPage' => $page,
        ]);
    }

    public function summary(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user')['id'] ?? null;
        $r = SupabaseHttp::rest('GET', 'transactions', [
            'select' => 'amount,type,category_id,transaction_date,categories(name,color,type)',
            'user_id' => 'eq.'.$userId,
        ]);
        if (! $r->successful()) {
            return response()->json(['error' => $r->body()], 400);
        }

        $data = $r->json();
        if (! is_array($data)) {
            $data = [];
        }

        $totalIncome = 0.0;
        $totalExpense = 0.0;
        $categorySplit = [];

        foreach ($data as $trx) {
            $amt = (float) ($trx['amount'] ?? 0);
            if (($trx['type'] ?? '') === 'income') {
                $totalIncome += $amt;
            } elseif (($trx['type'] ?? '') === 'expense') {
                $totalExpense += $amt;
                $c = $trx['categories'] ?? null;
                $catName = is_array($c) ? ($c['name'] ?? 'Uncategorized') : 'Uncategorized';
                $color = is_array($c) ? ($c['color'] ?? '#cccccc') : '#cccccc';
                if (! isset($categorySplit[$catName])) {
                    $categorySplit[$catName] = ['name' => $catName, 'color' => $color, 'total' => 0];
                }
                $categorySplit[$catName]['total'] += $amt;
            }
        }

        return response()->json([
            'summary' => [
                'totalIncome' => $totalIncome,
                'totalExpense' => $totalExpense,
                'totalSavings' => $totalIncome - $totalExpense,
                'categorySplit' => array_values($categorySplit),
            ],
        ]);
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user')['id'] ?? null;
        $r = SupabaseHttp::rest('GET', 'transactions', [
            'select' => '*,categories(*),parties(*)',
            'id' => 'eq.'.$id,
            'user_id' => 'eq.'.$userId,
            'limit' => 1,
        ]);
        if (! $r->successful() || ! is_array($r->json()) || count($r->json()) === 0) {
            return response()->json(['error' => 'Transaction not found.'], 404);
        }

        return response()->json(['transaction' => $r->json()[0]]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user')['id'] ?? null;
        $amount = $request->input('amount');
        $category_id = $request->input('category_id');
        $type = $request->input('type');
        if (! $amount || ! $type || ! $category_id) {
            return response()->json(['error' => 'Amount, type, and category_id are mathematically required.'], 400);
        }

        $receipt_url = $request->input('receipt_url');
        if ($request->hasFile('invoice')) {
            try {
                $receipt_url = StorageService::uploadFile('invoices', (string) $userId, $request->file('invoice'));
            } catch (\Throwable $e) {
                \Log::warning('Invoice upload failed', ['e' => $e->getMessage()]);
            }
        }

        $cat = SupabaseHttp::rest('GET', 'categories', [
            'select' => 'type',
            'id' => 'eq.'.$category_id,
            'limit' => 1,
        ]);
        if (! $cat->successful() || ! is_array($cat->json()) || count($cat->json()) === 0) {
            return response()->json(['error' => 'Invalid category selected.'], 400);
        }
        $category = $cat->json()[0];
        if (($category['type'] ?? '') !== $type) {
            return response()->json(['error' => "Category type ({$category['type']}) does not match transaction type ({$type})."], 400);
        }

        $resolvedPartyId = $request->input('party_id');
        $party_name = $request->input('party_name');
        if (! $resolvedPartyId && $party_name) {
            $ins = SupabaseHttp::rest('POST', 'parties', [], [[
                'user_id' => $userId,
                'name' => $party_name,
            ]]);
            if ($ins->successful() && is_array($ins->json()) && isset($ins->json()[0])) {
                $resolvedPartyId = $ins->json()[0]['id'];
            }
        }

        $patch = [
            'amount' => (float) $amount,
            'category_id' => $category_id,
            'party_id' => $resolvedPartyId ?: null,
            'type' => $type,
            'note' => $request->input('note'),
            'transaction_date' => $request->input('transaction_date'),
            'receipt_url' => $receipt_url,
        ];

        $r = SupabaseHttp::rest('PATCH', 'transactions', [
            'id' => 'eq.'.$id,
            'user_id' => 'eq.'.$userId,
        ], $patch);
        if (! $r->successful()) {
            return response()->json(['error' => $r->body()], 400);
        }

        $data = $r->json();

        return response()->json(['transaction' => is_array($data) && isset($data[0]) ? $data[0] : $data]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user')['id'] ?? null;
        $r = SupabaseHttp::rest('DELETE', 'transactions', [
            'id' => 'eq.'.$id,
            'user_id' => 'eq.'.$userId,
        ]);
        if (! $r->successful()) {
            return response()->json(['error' => $r->body()], 400);
        }

        return response()->json(['message' => 'Transaction deleted successfully.']);
    }
}
