<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\StorageService;
use App\Services\Supabase\SupabaseHttp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user')['id'] ?? null;
        if (! $userId) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $or = '(user_id.is.null,user_id.eq.'.$userId.')';
        $r = SupabaseHttp::rest('GET', 'categories', [
            'select' => '*',
            'or' => $or,
        ]);

        if (! $r->successful()) {
            return response()->json(['error' => $r->body()], 400);
        }

        $cats = $r->json();
        if (! is_array($cats)) {
            $cats = [];
        }

        $month_year = $request->query('month_year');
        $budgets = [];
        $spentMap = [];

        if (is_string($month_year) && $month_year !== '') {
            $b = SupabaseHttp::rest('GET', 'category_budgets', [
                'select' => 'category_id,amount',
                'user_id' => 'eq.'.$userId,
                'month_year' => 'eq.'.$month_year,
            ]);
            if ($b->successful() && is_array($b->json())) {
                $budgets = $b->json();
            }

            $startOfMonth = $month_year.'-01';
            $parts = explode('-', $month_year);
            $year = (int) ($parts[0] ?? 0);
            $month = (int) ($parts[1] ?? 0);
            $endOfMonth = sprintf('%04d-%02d-%02d', $year, $month, (int) date('t', mktime(0, 0, 0, $month, 1, $year)));

            $s = SupabaseHttp::rest('GET', 'transactions', [
                'select' => 'category_id,amount,transaction_date',
                'user_id' => 'eq.'.$userId,
                'type' => 'eq.expense',
            ]);
            if ($s->successful() && is_array($s->json())) {
                foreach ($s->json() as $t) {
                    $d = substr((string) ($t['transaction_date'] ?? ''), 0, 10);
                    if ($d < $startOfMonth || $d > $endOfMonth) {
                        continue;
                    }
                    $cid = $t['category_id'] ?? null;
                    if ($cid) {
                        $spentMap[$cid] = ($spentMap[$cid] ?? 0) + (float) ($t['amount'] ?? 0);
                    }
                }
            }
        }

        $categories = array_map(function ($c) use ($budgets, $spentMap) {
            $b = collect($budgets)->firstWhere('category_id', $c['id'] ?? null);

            return array_merge($c, [
                'monthly_budget' => $b ? $b['amount'] : null,
                'spent_amount' => $spentMap[$c['id'] ?? ''] ?? 0,
            ]);
        }, $cats);

        return response()->json(['categories' => $categories]);
    }

    public function createCustom(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user')['id'] ?? null;
        if (! $userId) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $name = $request->input('name');
        $type = $request->input('type');
        if (! $name || ! $type) {
            return response()->json(['error' => 'Name and type are required'], 400);
        }

        $icon_url = null;
        if ($request->hasFile('image')) {
            try {
                $icon_url = StorageService::uploadFile('category-icons', (string) $userId, $request->file('image'));
            } catch (\Throwable $e) {
                return response()->json(['error' => 'Image upload failed: '.$e->getMessage()], 400);
            }
        }

        $row = [
            'user_id' => $userId,
            'name' => $name,
            'type' => $type,
            'icon' => $request->input('icon') ?: 'Circle',
            'color' => $request->input('color') ?: '#aaaaaa',
            'icon_url' => $icon_url,
            'monthly_budget' => $request->has('monthly_budget') ? (float) $request->input('monthly_budget') : null,
        ];

        $r = SupabaseHttp::rest('POST', 'categories', [], [$row]);
        if (! $r->successful()) {
            return response()->json(['error' => $r->body()], 400);
        }

        $data = $r->json();

        return response()->json(['category' => is_array($data) && isset($data[0]) ? $data[0] : $data], 201);
    }

    public function updateBudget(Request $request, string $id): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user')['id'] ?? null;
        $monthly_budget = $request->input('monthly_budget');
        $month_year = $request->input('month_year');
        if ($monthly_budget === null || ! $month_year) {
            return response()->json(['error' => 'monthly_budget and month_year are required'], 400);
        }

        $row = [
            'user_id' => $userId,
            'category_id' => $id,
            'month_year' => $month_year,
            'amount' => (float) $monthly_budget,
        ];

        $r2 = SupabaseHttp::rest('PATCH', 'category_budgets', [
            'user_id' => 'eq.'.$userId,
            'category_id' => 'eq.'.$id,
            'month_year' => 'eq.'.$month_year,
        ], ['amount' => (float) $monthly_budget]);
        if ($r2->successful()) {
            $data = $r2->json();
            if (is_array($data) && $data !== []) {
                return response()->json(['budget' => $data[0] ?? $data]);
            }
        }

        $r = SupabaseHttp::rest('POST', 'category_budgets', [], [$row]);
        if (! $r->successful()) {
            return response()->json(['error' => $r->body()], 400);
        }
        $data = $r->json();

        return response()->json(['budget' => is_array($data) && isset($data[0]) ? $data[0] : $data]);
    }

    public function setMonthlyBudget(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user')['id'] ?? null;
        $category_id = $request->input('category_id');
        $monthly_budget = $request->input('monthly_budget');
        $month_year = $request->input('month_year');
        if (! $category_id || $monthly_budget === null || ! $month_year) {
            return response()->json(['error' => 'category_id, monthly_budget and month_year are required'], 400);
        }

        $row = [
            'user_id' => $userId,
            'category_id' => $category_id,
            'month_year' => $month_year,
            'amount' => (float) $monthly_budget,
        ];

        $r = SupabaseHttp::rest('POST', 'category_budgets', [], [$row]);
        if (! $r->successful()) {
            $r2 = SupabaseHttp::rest('PATCH', 'category_budgets', [
                'user_id' => 'eq.'.$userId,
                'category_id' => 'eq.'.$category_id,
                'month_year' => 'eq.'.$month_year,
            ], ['amount' => (float) $monthly_budget]);
            if (! $r2->successful()) {
                return response()->json(['error' => $r->body()], 400);
            }
            $data = $r2->json();

            return response()->json(['budget' => is_array($data) && isset($data[0]) ? $data[0] : $data]);
        }

        $data = $r->json();

        return response()->json(['budget' => is_array($data) && isset($data[0]) ? $data[0] : $data]);
    }
}
