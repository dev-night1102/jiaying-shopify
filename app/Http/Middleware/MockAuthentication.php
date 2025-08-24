<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
            DB::connection()->getPdo();
            // Database is available, proceed normally
            return $next($request);
        } catch (\Exception $e) {
            // Database not available, use mock user
            $this->setupMockUser($request);
        }
        
        return $next($request);
    }
    
    private function setupMockUser(Request $request)
    {
        // Create a mock user object that doesn't require database
        $mockUser = new class extends User {
            public $id = 1;
            public $name = 'Demo Admin';
            public $email = 'admin@demo.com';
            public $role = 'admin';
            public $balance = 1000.00;
            public $exists = true;
            
            public function __construct() {
                $this->created_at = now();
                $this->updated_at = now();
                // Don't call parent constructor to avoid database connection
            }
            
            // Override methods that might touch the database
            public function save(array $options = []) { return true; }
            public function delete() { return true; }
            public function fresh($with = []) { return $this; }
            public function refresh() { return $this; }
            public function replicate(array $except = null) { return $this; }
            
            // Mock relationships
            public function memberships() { return new \Illuminate\Database\Eloquent\Collection([]); }
            public function activeMembership() { return null; }
            public function orders() { return new \Illuminate\Database\Eloquent\Collection([]); }
            public function chats() { return new \Illuminate\Database\Eloquent\Collection([]); }
            
            // Ensure isAdmin works
            public function isAdmin(): bool {
                return $this->role === 'admin';
            }
        };
        
        // Set the mock user as authenticated
        $request->setUserResolver(function () use ($mockUser) {
            return $mockUser;
        });
        
        // Set in auth without database operations
        auth()->setUser($mockUser);
    }
}