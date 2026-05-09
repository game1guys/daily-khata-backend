<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Supabase\SupabaseHttp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AnalyticsController extends Controller
{
    private function fetchUserTransactions(string $userId): array
    {
        $r = SupabaseHttp::rest('GET', 'transactions', [
            'select' => 'amount,type,category_id,transaction_date,categories(name,color,icon_url)',
            'user_id' => 'eq.'.$userId,
        ]);
        if (! $r->successful()) {
            return [];
        }

        return is_array($r->json()) ? $r->json() : [];
    }

    private static function toYMD(\DateTimeInterface $d): string
    {
        return $d->format('Y-m-d');
    }

    public function overview(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user')['id'] ?? null;
        $period = $request->query('period', 'month');
        $dateStr = $request->query('date');

        $ref = new \DateTimeImmutable;
        if (is_string($dateStr) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $dateStr)) {
            $ref = \DateTimeImmutable::createFromFormat('Y-m-d', $dateStr) ?: $ref;
        }

        $rangeStart = $ref;
        $rangeEnd = $ref;

        if ($period === 'day') {
            $rangeStart = $ref->setTime(0, 0, 0);
            $rangeEnd = $ref->setTime(23, 59, 59);
        } elseif ($period === 'week') {
            $rangeStart = $ref->modify('monday this week')->setTime(0, 0, 0);
            $rangeEnd = $rangeStart->modify('+6 days')->setTime(23, 59, 59);
        } elseif ($period === 'quarter') {
            $q = (int) floor((int) $ref->format('n') / 3);
            $month = $q * 3 + 1;
            $rangeStart = $ref->setDate((int) $ref->format('Y'), $month, 1)->setTime(0, 0, 0);
            $rangeEnd = $rangeStart->modify('+3 months -1 day')->setTime(23, 59, 59);
        } elseif ($period === 'half') {
            $h = (int) floor((int) $ref->format('n') / 6);
            $month = $h * 6 + 1;
            $rangeStart = $ref->setDate((int) $ref->format('Y'), $month, 1)->setTime(0, 0, 0);
            $rangeEnd = $rangeStart->modify('+6 months -1 day')->setTime(23, 59, 59);
        } elseif ($period === 'year') {
            $rangeStart = $ref->setDate((int) $ref->format('Y'), 1, 1)->setTime(0, 0, 0);
            $rangeEnd = $ref->setDate((int) $ref->format('Y'), 12, 31)->setTime(23, 59, 59);
        } else {
            $rangeStart = $ref->modify('first day of this month')->setTime(0, 0, 0);
            $rangeEnd = $ref->modify('last day of this month')->setTime(23, 59, 59);
        }

        $startStr = self::toYMD($rangeStart);
        $endStr = self::toYMD($rangeEnd);

        $prevRangeStart = clone $rangeStart;
        $prevRangeEnd = clone $rangeEnd;
        if ($period === 'day') {
            $prevRangeStart = $prevRangeStart->modify('-1 day');
            $prevRangeEnd = $prevRangeEnd->modify('-1 day');
        } elseif ($period === 'week') {
            $prevRangeStart = $prevRangeStart->modify('-7 days');
            $prevRangeEnd = $prevRangeEnd->modify('-7 days');
        } elseif ($period === 'month') {
            $prevRangeStart = $prevRangeStart->modify('first day of last month');
            $prevRangeEnd = $prevRangeEnd->modify('last day of last month');
        } else {
            $prevRangeStart = $prevRangeStart->modify('-1 month');
            $prevRangeEnd = $prevRangeEnd->modify('-1 month');
        }

        $prevStartStr = self::toYMD($prevRangeStart);
        $prevEndStr = self::toYMD($prevRangeEnd);

        $filterCategoryId = $request->query('category_id');
        $filterCategoryId = is_string($filterCategoryId) && $filterCategoryId !== '' ? $filterCategoryId : null;

        $raw = $this->fetchUserTransactions($userId);

        $data = array_values(array_filter($raw, function ($trx) use ($startStr, $endStr, $filterCategoryId) {
            $d = substr((string) ($trx['transaction_date'] ?? ''), 0, 10);
            if ($d < $startStr || $d > $endStr) {
                return false;
            }
            if ($filterCategoryId && ($trx['category_id'] ?? '') !== $filterCategoryId) {
                return false;
            }

            return true;
        }));

        $prevData = array_values(array_filter($raw, function ($trx) use ($prevStartStr, $prevEndStr, $filterCategoryId) {
            $d = substr((string) ($trx['transaction_date'] ?? ''), 0, 10);
            if ($d < $prevStartStr || $d > $prevEndStr) {
                return false;
            }
            if ($filterCategoryId && ($trx['category_id'] ?? '') !== $filterCategoryId) {
                return false;
            }

            return true;
        }));

        $filterLabel = null;
        if ($filterCategoryId) {
            $fromTrx = collect($raw)->firstWhere('category_id', $filterCategoryId);
            $c = $fromTrx['categories'] ?? null;
            $filterLabel = is_array($c) ? ($c['name'] ?? null) : null;
            if (! $filterLabel) {
                $cr = SupabaseHttp::rest('GET', 'categories', [
                    'select' => 'name',
                    'id' => 'eq.'.$filterCategoryId,
                    'limit' => 1,
                ]);
                if ($cr->successful() && is_array($cr->json()) && isset($cr->json()[0])) {
                    $filterLabel = $cr->json()[0]['name'] ?? 'Category';
                }
            }
        }

        $bucketKeys = [];
        $cursor = \DateTimeImmutable::createFromMutable((new \DateTime($startStr)));
        $endDay = \DateTimeImmutable::createFromMutable((new \DateTime($endStr)));
        while ($cursor <= $endDay) {
            $bucketKeys[] = $cursor->format('Y-m-d');
            $cursor = $cursor->modify('+1 day');
        }

        $dailyBuckets = array_map(fn ($d) => ['date' => $d, 'income' => 0.0, 'expense' => 0.0, 'savings' => 0.0], $bucketKeys);
        $totals = ['income' => 0.0, 'expense' => 0.0, 'savings' => 0.0];
        $prevTotals = ['income' => 0.0, 'expense' => 0.0, 'savings' => 0.0];
        $expenseByCategory = [];
        $incomeByCategory = [];

        foreach ($data as $trx) {
            $d = substr((string) ($trx['transaction_date'] ?? ''), 0, 10);
            $amt = (float) ($trx['amount'] ?? 0);
            $idx = array_search($d, $bucketKeys, true);
            if (($trx['type'] ?? '') === 'income') {
                $totals['income'] += $amt;
                if ($idx !== false) {
                    $dailyBuckets[$idx]['income'] += $amt;
                }
                $catName = is_array($trx['categories'] ?? null) ? ($trx['categories']['name'] ?? 'Uncategorized') : 'Uncategorized';
                $color = is_array($trx['categories'] ?? null) ? ($trx['categories']['color'] ?? '#22c55e') : '#22c55e';
                $icon_url = is_array($trx['categories'] ?? null) ? ($trx['categories']['icon_url'] ?? '') : '';
                if (! isset($incomeByCategory[$catName])) {
                    $incomeByCategory[$catName] = ['value' => 0.0, 'color' => $color, 'icon_url' => $icon_url];
                }
                $incomeByCategory[$catName]['value'] += $amt;
            } elseif (($trx['type'] ?? '') === 'expense') {
                $totals['expense'] += $amt;
                if ($idx !== false) {
                    $dailyBuckets[$idx]['expense'] += $amt;
                }
                $catName = is_array($trx['categories'] ?? null) ? ($trx['categories']['name'] ?? 'Uncategorized') : 'Uncategorized';
                $color = is_array($trx['categories'] ?? null) ? ($trx['categories']['color'] ?? '#cbd5e1') : '#cbd5e1';
                $icon_url = is_array($trx['categories'] ?? null) ? ($trx['categories']['icon_url'] ?? '') : '';
                if (! isset($expenseByCategory[$catName])) {
                    $expenseByCategory[$catName] = ['value' => 0.0, 'color' => $color, 'icon_url' => $icon_url];
                }
                $expenseByCategory[$catName]['value'] += $amt;
            }
        }

        foreach ($prevData as $trx) {
            $amt = (float) ($trx['amount'] ?? 0);
            if (($trx['type'] ?? '') === 'income') {
                $prevTotals['income'] += $amt;
            } elseif (($trx['type'] ?? '') === 'expense') {
                $prevTotals['expense'] += $amt;
            }
        }

        foreach ($dailyBuckets as &$b) {
            $b['savings'] = $b['income'] - $b['expense'];
        }
        unset($b);
        $totals['savings'] = $totals['income'] - $totals['expense'];
        $prevTotals['savings'] = $prevTotals['income'] - $prevTotals['expense'];

        $toArr = function (array $rec) {
            return collect($rec)->map(fn ($v, $name) => [
                'name' => $name,
                'value' => $v['value'],
                'color' => $v['color'],
                'icon_url' => $v['icon_url'],
            ])->sortByDesc('value')->values()->all();
        };

        return response()->json([
            'period' => $period,
            'range' => ['start' => $startStr, 'end' => $endStr],
            'prevRange' => ['start' => $prevStartStr, 'end' => $prevEndStr],
            'totals' => $totals,
            'prevTotals' => $prevTotals,
            'dailyBuckets' => $dailyBuckets,
            'expenseByCategory' => $toArr($expenseByCategory),
            'incomeByCategory' => $toArr($incomeByCategory),
            'filter' => $filterCategoryId ? ['category_id' => $filterCategoryId, 'name' => $filterLabel ?: 'Category'] : null,
        ]);
    }

    public function ledgerLines(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user')['id'] ?? null;
        $all = $request->query('all') === 'true' || $request->query('all') === '1';
        $start = $request->query('start');
        $end = $request->query('end');
        $categoryId = is_string($request->query('category_id')) && $request->query('category_id') !== ''
            ? $request->query('category_id') : null;

        if (! $all && (! is_string($start) || ! is_string($end) || ! preg_match('/^\d{4}-\d{2}-\d{2}$/', $start) || ! preg_match('/^\d{4}-\d{2}-\d{2}$/', $end))) {
            return response()->json(['error' => 'Use start & end (YYYY-MM-DD), or all=1 for every transaction.'], 400);
        }

        $raw = [];
        $offset = 0;
        $pageSize = 1000;

        do {
            $q = [
                'select' => 'id,transaction_date,type,amount,note,category_id,categories(name),parties(name,phone)',
                'user_id' => 'eq.'.$userId,
                'order' => 'transaction_date.asc',
            ];
            if ($categoryId) {
                $q['category_id'] = 'eq.'.$categoryId;
            }

            $url = SupabaseHttp::base().'/rest/v1/transactions?'.http_build_query($q, '', '&', PHP_QUERY_RFC3986);
            $r = Http::withHeaders(array_merge(SupabaseHttp::serviceHeaders(), [
                'Range' => $offset.'-'.($offset + $pageSize - 1),
            ]))->get($url);

            if (! $r->successful()) {
                return response()->json(['error' => $r->body()], 400);
            }
            $chunk = $r->json() ?: [];
            $raw = array_merge($raw, $chunk);
            if (count($chunk) < $pageSize) {
                break;
            }
            $offset += $pageSize;
        } while (true);

        if (! $all) {
            $raw = array_values(array_filter($raw, function ($trx) use ($start, $end) {
                $d = substr((string) ($trx['transaction_date'] ?? ''), 0, 10);

                return $d >= $start && $d <= $end;
            }));
        }

        $rows = [];
        foreach ($raw as $idx => $trx) {
            $c = $trx['categories'] ?? null;
            $p = $trx['parties'] ?? null;
            $catName = is_array($c) ? ($c['name'] ?? '—') : '—';
            $partyName = is_array($p) ? ($p['name'] ?? '') : '';
            $partyPhone = is_array($p) ? ($p['phone'] ?? '') : '';
            $rows[] = [
                'row' => $idx + 1,
                'date' => substr((string) ($trx['transaction_date'] ?? ''), 0, 10),
                'type' => $trx['type'] ?? '',
                'category' => $catName,
                'amount' => (float) ($trx['amount'] ?? 0),
                'note' => $trx['note'] ?? '',
                'party' => $partyName,
                'party_phone' => $partyPhone,
            ];
        }

        if ($all && $rows !== []) {
            $rangeOut = ['start' => $rows[0]['date'], 'end' => $rows[count($rows) - 1]['date']];
        } elseif ($all) {
            $rangeOut = ['start' => '—', 'end' => '—'];
        } else {
            $rangeOut = ['start' => $start, 'end' => $end];
        }

        return response()->json([
            'range' => $rangeOut,
            'all' => $all,
            'expenses' => array_values(array_filter($rows, fn ($r) => $r['type'] === 'expense')),
            'income' => array_values(array_filter($rows, fn ($r) => $r['type'] === 'income')),
            'rows' => $rows,
        ]);
    }

    public function monthlyBar(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user')['id'] ?? null;
        $data = $this->fetchUserTransactions($userId);

        $currentMonth = (int) date('n') - 1;
        $currentYear = (int) date('Y');
        $daysInMonth = (int) date('t', mktime(0, 0, 0, $currentMonth + 1, 1, $currentYear));

        $dailyData = [];
        for ($i = 1; $i <= $daysInMonth; $i++) {
            $dayStr = sprintf('%04d-%02d-%02d', $currentYear, $currentMonth + 1, $i);
            $dailyData[$dayStr] = ['date' => $dayStr, 'income' => 0.0, 'expense' => 0.0, 'savings' => 0.0];
        }

        foreach ($data as $trx) {
            $trxDate = strtotime((string) ($trx['transaction_date'] ?? ''));
            if (! $trxDate) {
                continue;
            }
            if ((int) date('n', $trxDate) - 1 === $currentMonth && (int) date('Y', $trxDate) === $currentYear) {
                $dateKey = substr((string) $trx['transaction_date'], 0, 10);
                if (isset($dailyData[$dateKey])) {
                    $amt = (float) ($trx['amount'] ?? 0);
                    if (($trx['type'] ?? '') === 'income') {
                        $dailyData[$dateKey]['income'] += $amt;
                    }
                    if (($trx['type'] ?? '') === 'expense') {
                        $dailyData[$dateKey]['expense'] += $amt;
                    }
                    $dailyData[$dateKey]['savings'] = $dailyData[$dateKey]['income'] - $dailyData[$dateKey]['expense'];
                }
            }
        }

        return response()->json(['chartData' => array_values($dailyData)]);
    }

    public function weeklyTrend(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user')['id'] ?? null;
        $data = $this->fetchUserTransactions($userId);
        $currentMonth = (int) date('n') - 1;

        $weeklyData = [
            ['week' => 'Week 1', 'expense' => 0.0, 'savings' => 0.0, 'income' => 0.0],
            ['week' => 'Week 2', 'expense' => 0.0, 'savings' => 0.0, 'income' => 0.0],
            ['week' => 'Week 3', 'expense' => 0.0, 'savings' => 0.0, 'income' => 0.0],
            ['week' => 'Week 4', 'expense' => 0.0, 'savings' => 0.0, 'income' => 0.0],
        ];

        foreach ($data as $trx) {
            $trxDate = strtotime((string) ($trx['transaction_date'] ?? ''));
            if (! $trxDate) {
                continue;
            }
            if ((int) date('n', $trxDate) - 1 !== $currentMonth) {
                continue;
            }
            $day = (int) date('j', $trxDate);
            $weekIndex = 0;
            if ($day > 7 && $day <= 14) {
                $weekIndex = 1;
            } elseif ($day > 14 && $day <= 21) {
                $weekIndex = 2;
            } elseif ($day > 21) {
                $weekIndex = 3;
            }
            $amt = (float) ($trx['amount'] ?? 0);
            if (($trx['type'] ?? '') === 'income') {
                $weeklyData[$weekIndex]['income'] += $amt;
            }
            if (($trx['type'] ?? '') === 'expense') {
                $weeklyData[$weekIndex]['expense'] += $amt;
            }
            $weeklyData[$weekIndex]['savings'] = $weeklyData[$weekIndex]['income'] - $weeklyData[$weekIndex]['expense'];
        }

        return response()->json(['weeklyTrends' => $weeklyData]);
    }

    public function compareDays(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user')['id'] ?? null;
        $date1 = $request->query('date1');
        $date2 = $request->query('date2');
        if (! $date1 || ! $date2) {
            return response()->json(['error' => 'Missing date1 or date2 query parameters.'], 400);
        }

        $data = $this->fetchUserTransactions($userId);
        $metrics = [
            $date1 => ['income' => 0.0, 'expense' => 0.0, 'savings' => 0.0],
            $date2 => ['income' => 0.0, 'expense' => 0.0, 'savings' => 0.0],
        ];

        foreach ($data as $trx) {
            $d = substr((string) ($trx['transaction_date'] ?? ''), 0, 10);
            if ($d !== $date1 && $d !== $date2) {
                continue;
            }
            $amt = (float) ($trx['amount'] ?? 0);
            if (($trx['type'] ?? '') === 'income') {
                $metrics[$d]['income'] += $amt;
            }
            if (($trx['type'] ?? '') === 'expense') {
                $metrics[$d]['expense'] += $amt;
            }
            $metrics[$d]['savings'] = $metrics[$d]['income'] - $metrics[$d]['expense'];
        }

        return response()->json(['comparison' => $metrics]);
    }

    public function categoryChart(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user')['id'] ?? null;
        $data = $this->fetchUserTransactions($userId);
        $distribution = [];

        foreach ($data as $trx) {
            if (($trx['type'] ?? '') !== 'expense') {
                continue;
            }
            $catName = is_array($trx['categories'] ?? null) ? ($trx['categories']['name'] ?? 'Uncategorized') : 'Uncategorized';
            $color = is_array($trx['categories'] ?? null) ? ($trx['categories']['color'] ?? '#cbd5e1') : '#cbd5e1';
            $amt = (float) ($trx['amount'] ?? 0);
            if (! isset($distribution[$catName])) {
                $distribution[$catName] = ['value' => 0.0, 'color' => $color];
            }
            $distribution[$catName]['value'] += $amt;
        }

        $chartArray = collect($distribution)->map(fn ($v, $k) => [
            'name' => $k,
            'value' => $v['value'],
            'color' => $v['color'],
        ])->sortByDesc('value')->values()->all();

        return response()->json(['categoryChart' => $chartArray]);
    }
}
