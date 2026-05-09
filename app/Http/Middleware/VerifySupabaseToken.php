<?php

namespace App\Http\Middleware;

use App\Services\Supabase\SupabaseHttp;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifySupabaseToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $auth = $request->header('Authorization', '');
        if (! str_starts_with($auth, 'Bearer ')) {
            return response()->json(['error' => 'Unauthorized: No token provided'], 401);
        }
        $token = substr($auth, 7);
        $user = SupabaseHttp::getUser($token);
        if (! $user) {
            return response()->json(['error' => 'Unauthorized: Invalid token'], 401);
        }
        $request->attributes->set('supabase_user', $user);
        $request->attributes->set('supabase_token', $token);

        return $next($request);
    }
}
