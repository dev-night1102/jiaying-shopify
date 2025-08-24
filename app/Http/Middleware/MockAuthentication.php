<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;

class MockAuthentication
{
    /**
     * Handle an incoming request.
     * This middleware provides mock authentication when database is not available.
     */
    public function handle(Request $request, Closure $next)
    {
        // Check if database is available
        try {
            \DB::connection()->getPdo();
            // Database is available, proceed normally
            return $next($request);
        } catch (\Exception $e) {
            // Database not available, use mock user
            if (!$request->user()) {
                // Create a mock user object
                $mockUser = new User();
                $mockUser->id = 1;
                $mockUser->name = 'Demo User';
                $mockUser->email = 'demo@example.com';
                $mockUser->role = $request->is('admin/*') ? 'admin' : 'user';
                $mockUser->balance = 1000.00;
                $mockUser->created_at = now();
                $mockUser->updated_at = now();
                
                // Set the mock user as authenticated
                $request->setUserResolver(function () use ($mockUser) {
                    return $mockUser;
                });
                
                auth()->setUser($mockUser);
            }
        }
        
        return $next($request);
    }
}