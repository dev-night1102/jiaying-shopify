<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MembershipMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        if (!$user || !$user->activeMembership) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Active membership required'], 403);
            }
            
            return redirect()->route('membership.plans');
        }

        return $next($request);
    }
}