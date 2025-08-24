<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Production Demo Routes
|--------------------------------------------------------------------------
|
| These routes provide demo functionality when database is not available
|
*/

// Production-safe orders page that works without database/auth
Route::get('/orders', function () {
    // Check if this is production (Render.com)
    $isProduction = request()->getHost() === 'jiaying-shopify.onrender.com';
    
    if (!$isProduction) {
        // Redirect to normal auth flow in development
        return redirect()->route('login');
    }
    
    // Create mock user for production demo
    $mockUser = (object) [
        'id' => 1,
        'name' => 'Demo Admin',
        'email' => 'admin@demo.com',
        'role' => 'admin',
        'balance' => 1000.00,
        'isAdmin' => function() { return true; }
    ];
    
    // Create mock orders with Shopify integration examples
    $mockOrders = collect([
        (object) [
            'id' => 1,
            'order_number' => 'ORD-2024-001',
            'user_id' => 1,
            'user' => (object) [
                'id' => 1,
                'name' => 'Demo Admin',
                'email' => 'admin@demo.com',
            ],
            'product_link' => 'https://nike.com/air-jordan-1',
            'status' => 'quoted',
            'payment_status' => 'pending',
            'item_cost' => 150.00,
            'service_fee' => 15.00,
            'shipping_estimate' => 25.00,
            'total_cost' => 190.00,
            'checkout_url' => 'https://checkout.shopify.com/55847428/checkouts/demo123',
            'shopify_order_id' => null,
            'notes' => 'Size 10, Red/Black colorway',
            'created_at' => now()->subDays(2)->toISOString(),
            'updated_at' => now()->subDays(1)->toISOString(),
            'quoted_at' => now()->subDays(1)->toISOString(),
            'images' => [],
            'logistics' => null,
            'chats' => collect([]),
            'chat_id' => null,
        ],
        (object) [
            'id' => 2,
            'order_number' => 'ORD-2024-002',
            'user_id' => 1,
            'user' => (object) [
                'id' => 1,
                'name' => 'Demo Admin',
                'email' => 'admin@demo.com',
            ],
            'product_link' => 'https://supreme.com/box-logo-tee',
            'status' => 'paid',
            'payment_status' => 'paid',
            'item_cost' => 85.00,
            'service_fee' => 8.50,
            'shipping_estimate' => 15.00,
            'total_cost' => 108.50,
            'checkout_url' => null,
            'shopify_order_id' => 'gid://shopify/Order/5479145676893',
            'notes' => 'Size Large, White',
            'created_at' => now()->subDays(5)->toISOString(),
            'updated_at' => now()->subDays(3)->toISOString(),
            'quoted_at' => now()->subDays(4)->toISOString(),
            'paid_at' => now()->subDays(3)->toISOString(),
            'images' => [],
            'logistics' => null,
            'chats' => collect([]),
            'chat_id' => null,
        ],
        (object) [
            'id' => 3,
            'order_number' => 'ORD-2024-003',
            'user_id' => 1,
            'user' => (object) [
                'id' => 1,
                'name' => 'Demo Admin',
                'email' => 'admin@demo.com',
            ],
            'product_link' => 'https://adidas.com/yeezy-boost-350',
            'status' => 'requested',
            'payment_status' => 'pending',
            'item_cost' => null,
            'service_fee' => null,
            'shipping_estimate' => null,
            'total_cost' => null,
            'checkout_url' => null,
            'shopify_order_id' => null,
            'notes' => 'Looking for size 9.5 in any colorway',
            'created_at' => now()->subHours(2)->toISOString(),
            'updated_at' => now()->subHours(2)->toISOString(),
            'images' => [],
            'logistics' => null,
            'chats' => collect([]),
            'chat_id' => null,
        ],
    ]);
    
    // Create paginated response structure
    $orders = new \Illuminate\Pagination\LengthAwarePaginator(
        $mockOrders,
        $mockOrders->count(),
        20,
        1,
        ['path' => request()->url()]
    );
    
    return Inertia::render('Orders/Index', [
        'orders' => $orders,
        'isAdmin' => true,
        'auth' => ['user' => $mockUser], // Provide auth context for Inertia
    ]);
})->name('orders.index');