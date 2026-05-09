<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Supabase\SupabaseHttp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user')['id'] ?? null;
        if (! $userId) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $allowedStatuses = ['pending', 'ongoing', 'done'];

        $primary = SupabaseHttp::rest('GET', 'user_todos', [
            'select' => 'id,title,created_at,todo_date,status',
            'user_id' => 'eq.'.$userId,
            'order' => 'created_at.desc',
        ]);

        $rawTodos = [];
        if ($primary->successful()) {
            $rawTodos = $primary->json() ?: [];
        } else {
            $fallback = SupabaseHttp::rest('GET', 'user_todos', [
                'select' => 'id,title,created_at,todo_date',
                'user_id' => 'eq.'.$userId,
                'order' => 'created_at.desc',
            ]);
            if (! $fallback->successful()) {
                return response()->json(['error' => $fallback->body()], 400);
            }
            $rawTodos = $fallback->json() ?: [];
        }

        $todos = array_map(function ($t) use ($allowedStatuses) {
            $status = $t['status'] ?? 'pending';

            return array_merge($t, [
                'todo_date' => $t['todo_date'] ?? null,
                'status' => in_array($status, $allowedStatuses, true) ? $status : 'pending',
            ]);
        }, $rawTodos);

        return response()->json(['todos' => $todos]);
    }

    public function store(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user')['id'] ?? null;
        if (! $userId) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $title = is_string($request->input('title')) ? trim($request->input('title')) : '';
        if ($title === '') {
            return response()->json(['error' => 'title is required'], 400);
        }

        $todoDateRaw = $request->input('todo_date');
        $todoDate = is_string($todoDateRaw) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $todoDateRaw) ? $todoDateRaw : null;

        $allowedStatuses = ['pending', 'ongoing', 'done'];
        $statusRaw = $request->input('status');
        $status = is_string($statusRaw) && in_array($statusRaw, $allowedStatuses, true) ? $statusRaw : 'pending';

        $insertPayload = ['user_id' => $userId, 'title' => $title, 'status' => $status];
        if ($todoDate) {
            $insertPayload['todo_date'] = $todoDate;
        }

        $r = SupabaseHttp::rest('POST', 'user_todos', [], [$insertPayload]);
        if (! $r->successful()) {
            $r2 = SupabaseHttp::rest('POST', 'user_todos', [], [['user_id' => $userId, 'title' => $title]]);
            if (! $r2->successful()) {
                return response()->json(['error' => $r2->body()], 400);
            }
            $data = $r2->json();

            return response()->json(['todo' => is_array($data) && isset($data[0]) ? $data[0] : $data], 201);
        }

        $data = $r->json();

        return response()->json(['todo' => is_array($data) && isset($data[0]) ? $data[0] : $data], 201);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user')['id'] ?? null;
        if (! $userId) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $r = SupabaseHttp::rest('DELETE', 'user_todos', [
            'id' => 'eq.'.$id,
            'user_id' => 'eq.'.$userId,
        ]);
        if (! $r->successful()) {
            return response()->json(['error' => $r->body()], 400);
        }

        return response()->json(['ok' => true]);
    }

    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user')['id'] ?? null;
        if (! $userId) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $allowedStatuses = ['pending', 'ongoing', 'done'];
        $statusRaw = (string) $request->input('status', '');
        $status = in_array($statusRaw, $allowedStatuses, true) ? $statusRaw : null;
        if (! $status) {
            return response()->json(['error' => 'status must be pending/ongoing/done'], 400);
        }

        if ($status === 'done') {
            $r = SupabaseHttp::rest('DELETE', 'user_todos', [
                'id' => 'eq.'.$id,
                'user_id' => 'eq.'.$userId,
            ]);
            if (! $r->successful()) {
                return response()->json(['error' => $r->body()], 400);
            }

            return response()->json(['ok' => true, 'deleted' => true]);
        }

        $r = SupabaseHttp::rest('PATCH', 'user_todos', [
            'id' => 'eq.'.$id,
            'user_id' => 'eq.'.$userId,
        ], ['status' => $status]);
        if (! $r->successful()) {
            return response()->json(['error' => $r->body()], 400);
        }

        $data = $r->json();

        return response()->json(['todo' => is_array($data) && isset($data[0]) ? $data[0] : $data]);
    }
}
