<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DatabaseFallbackMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Test database connection
        try {
            DB::connection()->getPdo();
            // Database is available, proceed normally
            return $next($request);
        } catch (\Exception $e) {
            // Database is not available, check if this is a request that needs fallback
            Log::warning('Database unavailable, attempting fallback', ['error' => $e->getMessage()]);
            
            if ($this->shouldHandleWithFallback($request)) {
                return $this->handleFallbackRequest($request);
            }
            
            // For other requests, let them fail normally
            return $next($request);
        }
    }
    
    private function shouldHandleWithFallback(Request $request): bool
    {
        $path = $request->path();
        
        // Only handle specific routes that need fallback
        $fallbackRoutes = [
            'orders',
            'orders/create',
            'dashboard',
            'admin/dashboard',
            'admin/orders',
            'admin/users',
        ];
        
        // Also handle POST requests to orders
        $fallbackPostRoutes = [
            'orders',
        ];
        
        return in_array($path, $fallbackRoutes) || 
               preg_match('#^orders/\d+$#', $path) ||
               preg_match('#^admin/orders/\d+$#', $path) ||
               ($request->isMethod('POST') && in_array($path, $fallbackPostRoutes));
    }
    
    private function handleFallbackRequest(Request $request): Response
    {
        $path = $request->path();
        
        // Create mock user for fallback (determine if admin based on path)
        $isAdminPath = str_contains($path, 'admin');
        $mockUser = (object) [
            'id' => 1,
            'name' => $isAdminPath ? 'Demo Admin' : 'Demo User',
            'email' => $isAdminPath ? 'admin@example.com' : 'demo@example.com',
            'role' => $isAdminPath ? 'admin' : 'user',
            'balance' => 1000.00,
            'isAdmin' => function() use ($isAdminPath) { return $isAdminPath; },
        ];
        
        // Set mock user in request
        $request->setUserResolver(function () use ($mockUser) {
            return $mockUser;
        });
        
        if ($path === 'orders' || $path === 'admin/orders') {
            return $this->handleOrdersListFallback(str_contains($path, 'admin'));
        }
        
        if (preg_match('#^orders/(\d+)$#', $path, $matches) || preg_match('#^admin/orders/(\d+)$#', $path, $matches)) {
            $isAdmin = str_contains($path, 'admin');
            return $this->handleOrderShowFallback($matches[1], $isAdmin);
        }
        
        if ($path === 'dashboard' || $path === 'admin/dashboard') {
            return $this->handleDashboardFallback(str_contains($path, 'admin'));
        }
        
        if ($path === 'admin/users') {
            return $this->handleUsersListFallback();
        }
        
        if ($path === 'orders/create') {
            return $this->handleOrderCreateFallback();
        }
        
        if ($request->isMethod('POST') && $path === 'orders') {
            return $this->handleOrderStoreFallback();
        }
        
        // Default fallback
        return response()->json(['error' => 'Service temporarily unavailable'], 503);
    }
    
    private function handleOrdersListFallback($isAdmin = false)
    {
        $mockOrders = collect([
            (object) [
                'id' => 1,
                'order_number' => 'DEMO-001',
                'user_id' => 1,
                'user' => (object) ['name' => 'Demo User', 'email' => 'demo@example.com'],
                'status' => 'requested',
                'product_link' => 'https://example.com/demo-product',
                'created_at' => now(),
                'total_cost' => 0.00,
                'item_cost' => 0.00,
                'service_fee' => 0.00,
                'chat_id' => null,
                'images' => [],
                'chats' => [],
                'logistics' => null,
            ]
        ]);
        
        $paginatedOrders = new \Illuminate\Pagination\LengthAwarePaginator(
            $mockOrders, 1, 20, 1, ['path' => request()->url()]
        );
        
        $template = $isAdmin ? 'Admin/Orders/Index' : 'Orders/Index';
        
        return inertia($template, [
            'orders' => $paginatedOrders,
            'isAdmin' => $isAdmin,
        ]);
    }
    
    private function handleOrderShowFallback($orderId, $isAdmin = false)
    {
        $mockOrder = (object) [
            'id' => (int) $orderId,
            'order_number' => 'DEMO-' . str_pad($orderId, 3, '0', STR_PAD_LEFT),
            'user_id' => 1,
            'user' => (object) ['name' => 'Demo User', 'email' => 'demo@example.com'],
            'status' => 'requested',
            'product_link' => 'https://example.com/demo-product',
            'notes' => 'Demo order - Database unavailable',
            'created_at' => now(),
            'updated_at' => now(),
            'images' => [],
            'chats' => [],
            'logistics' => null,
            'item_cost' => 0.00,
            'service_fee' => 0.00,
            'shipping_estimate' => 0.00,
            'total_cost' => 0.00,
            'specifications' => 'Demo specifications',
            'quantity' => 1,
        ];
        
        $template = $isAdmin ? 'Admin/Orders/Show' : 'Orders/Show';
        
        return inertia($template, [
            'order' => $mockOrder,
            'isAdmin' => $isAdmin,
        ]);
    }
    
    private function handleDashboardFallback($isAdmin = false)
    {
        $stats = [
            'total_orders' => 0,
            'pending_orders' => 0,
            'total_spent' => 0.00,
            'active_chats' => 0,
        ];
        
        if ($isAdmin) {
            $stats = array_merge($stats, [
                'totalUsers' => 0,
                'activeOrders' => 0,
                'completedOrders' => 0,
                'totalRevenue' => 0,
                'monthlyRevenue' => 0,
                'userGrowth' => 0,
                'orderGrowth' => 0,
                'conversionRate' => 0,
            ]);
        }
        
        $template = $isAdmin ? 'Admin/Dashboard' : 'Dashboard';
        
        return inertia($template, [
            'stats' => $stats,
            'recentOrders' => collect([]),
            'recentActivities' => collect([]),
            'chartData' => $isAdmin ? [
                'monthlyOrders' => [],
                'monthlyRevenue' => [],
            ] : null,
            'pendingQuotes' => $isAdmin ? collect([]) : null,
        ]);
    }
    
    private function handleUsersListFallback()
    {
        $mockUsers = collect([
            (object) [
                'id' => 1,
                'name' => 'Demo User',
                'email' => 'demo@example.com',
                'role' => 'user',
                'balance' => 1000.00,
                'created_at' => now(),
                'updated_at' => now(),
                'orders_count' => 2,
                'total_spent' => 250.00,
                'memberships' => [],
                'activeMembership' => null,
            ],
            (object) [
                'id' => 2,
                'name' => 'Demo Admin',
                'email' => 'admin@example.com',
                'role' => 'admin',
                'balance' => 5000.00,
                'created_at' => now()->subDays(10),
                'updated_at' => now()->subDays(1),
                'orders_count' => 0,
                'total_spent' => 0.00,
                'memberships' => [],
                'activeMembership' => null,
            ]
        ]);
        
        $paginatedUsers = new \Illuminate\Pagination\LengthAwarePaginator(
            $mockUsers, $mockUsers->count(), 20, 1, ['path' => request()->url()]
        );
        
        // Match the real controller's filter structure
        $filters = [
            'search' => null,
            'role' => null,
            'sort' => 'latest'
        ];
        
        return inertia('Admin/Users/Index', [
            'users' => $paginatedUsers,
            'filters' => $filters,
        ]);
    }
    
    private function handleOrderCreateFallback()
    {
        $mockUser = (object) [
            'id' => 1,
            'name' => 'Demo User',
            'email' => 'demo@example.com',
            'role' => 'user',
            'balance' => 1000.00,
        ];
        
        return inertia('Orders/Create', [
            'user' => $mockUser,
        ]);
    }
    
    private function handleOrderStoreFallback()
    {
        // Simulate successful order creation
        return redirect()->route('orders.show', ['id' => 1])
            ->with('success', 'Order created successfully! (Demo mode - database unavailable)');
    }
}
