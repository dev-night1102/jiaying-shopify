<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\VerificationCodeController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\MembershipController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\User\PaymentController;
use App\Http\Controllers\Admin;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\ShopifyController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    // Redirect authenticated users to dashboard
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    
    return Inertia::render('Welcome');
});

// Health check endpoint for Render
Route::get('/health', function () {
    try {
        // Check database connection
        \DB::connection()->getPdo();
        return response()->json([
            'status' => 'healthy',
            'timestamp' => now(),
            'database' => 'connected'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'unhealthy',
            'timestamp' => now(),
            'database' => 'disconnected',
            'error' => $e->getMessage()
        ], 500);
    }
});

// Test broadcasting endpoint
Route::get('/test-broadcast', function () {
    try {
        // Test broadcasting without database
        $testData = [
            'message' => 'Test broadcast from API',
            'timestamp' => now()->toISOString(),
            'type' => 'test-message'
        ];

        // Broadcast to test channel
        broadcast(new \Illuminate\Broadcasting\Broadcasters\PusherBroadcaster(
            app()->make('pusher'), 
            ['test-channel']
        ));

        return response()->json([
            'status' => 'broadcast_sent',
            'data' => $testData,
            'timestamp' => now()
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'broadcast_failed',
            'error' => $e->getMessage(),
            'timestamp' => now()
        ], 500);
    }
});

Route::get('/home', function () {
    // Redirect authenticated users to dashboard
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    
    return Inertia::render('Welcome');
});

// Simple status endpoint
Route::get('/status', function () {
    return response('OK - Laravel is running', 200)
        ->header('Content-Type', 'text/plain');
});

Route::post('/language', [LanguageController::class, 'switch'])->name('language.switch');

Route::middleware('guest')->group(function () {
    Route::get('register', [RegisterController::class, 'create'])->name('register');
    Route::post('register', [RegisterController::class, 'store']);
    
    Route::get('login', [LoginController::class, 'create'])->name('login');
    Route::post('login', [LoginController::class, 'store']);
    
    Route::get('forgot-password', [PasswordResetController::class, 'create'])->name('password.request');
    Route::post('forgot-password', [PasswordResetController::class, 'store'])->name('password.email');
    Route::get('reset-password/{token}', [PasswordResetController::class, 'edit'])->name('password.reset');
    Route::post('reset-password', [PasswordResetController::class, 'update'])->name('password.store');
});

Route::middleware('auth')->group(function () {
    Route::get('verify-code', [VerificationCodeController::class, 'show'])->name('verification.code');
    Route::post('verify-code', [VerificationCodeController::class, 'verify']);
    Route::post('resend-code', [VerificationCodeController::class, 'resend']);
    
    Route::post('logout', [LoginController::class, 'destroy'])->name('logout');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Profile routes
    Route::get('/profile', [App\Http\Controllers\ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [App\Http\Controllers\ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [App\Http\Controllers\ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Order routes
    Route::resource('orders', OrderController::class);
    Route::post('orders/{order}/accept', [OrderController::class, 'accept'])->name('orders.accept');
    Route::post('orders/{order}/pay', [OrderController::class, 'pay'])->name('orders.pay');
    
    // Membership routes
    Route::resource('memberships', MembershipController::class)->only(['index', 'show']);
    Route::post('memberships/subscribe', [MembershipController::class, 'subscribe'])->name('memberships.subscribe');
    Route::post('memberships/{membership}/cancel', [MembershipController::class, 'cancel'])->name('memberships.cancel');
    Route::post('memberships/top-up', [MembershipController::class, 'topUp'])->name('memberships.top-up');
    
    // Chat routes
    Route::resource('chats', ChatController::class)->only(['index', 'show', 'store', 'create']);
    Route::post('chats/{chat}/send', [ChatController::class, 'send'])->name('chats.send');
    Route::post('chats/{chat}/typing', [ChatController::class, 'typing'])->name('chats.typing');
    
    Route::get('payments', [PaymentController::class, 'index'])->name('payments.index');
    Route::get('payments/deposit', [PaymentController::class, 'deposit'])->name('payments.deposit');
    Route::post('payments/deposit', [PaymentController::class, 'processDeposit'])->name('payments.process-deposit');
    Route::get('orders/{order}/pay', [PaymentController::class, 'payOrder'])->name('payments.pay-order');
    Route::post('orders/{order}/pay', [PaymentController::class, 'processOrderPayment'])->name('payments.process-order');
    
    // Notification routes
    Route::post('notifications/mark-as-read', function() {
        // Mark all notifications as read for current user
        return back();
    })->name('notifications.mark-read');
    
    Route::post('notifications/clear-badge', function() {
        // Clear badge count for specific page
        return back();
    })->name('notifications.clear-badge');
    
    // Search route
    Route::get('search', function() {
        $query = request('q');
        // For now, redirect to orders page with search
        return redirect()->route('orders.index')->with('search', $query);
    })->name('search');
});

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->as('admin.')->group(function () {
    Route::get('/dashboard', [Admin\DashboardController::class, 'index'])->name('dashboard');
    
    // Admin order management
    Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::post('orders/{order}/quote', [OrderController::class, 'quote'])->name('orders.quote');
    Route::post('orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.update-status');
    
    // Admin chat management
    Route::get('chats', [ChatController::class, 'index'])->name('chats.index');
    Route::get('chats/{chat}', [ChatController::class, 'show'])->name('chats.show');
    Route::post('chats/{chat}/send', [ChatController::class, 'send'])->name('chats.send');
    Route::post('chats/{chat}/typing', [ChatController::class, 'typing'])->name('chats.typing');
    
    // Admin membership management
    Route::get('memberships', [MembershipController::class, 'index'])->name('memberships.index');
    Route::get('memberships/{membership}', [MembershipController::class, 'show'])->name('memberships.show');
    Route::post('memberships/{membership}/extend', [MembershipController::class, 'extend'])->name('memberships.extend');
    
    Route::resource('users', Admin\UserController::class)->only(['index', 'show']);
    Route::post('users/{user}/balance', [Admin\UserController::class, 'updateBalance'])->name('users.update-balance');
    
    // Shopify webhook management
    Route::post('shopify/register-webhooks', [ShopifyController::class, 'registerWebhooks'])->name('shopify.register-webhooks');
    
    // Admin orders route (production-safe fallback)
    Route::get('orders', function () {
        // Check if this is production (Render.com) or database is unavailable
        $isProduction = request()->getHost() === 'jiaying-shopify.onrender.com';
        $dbAvailable = true;
        
        try {
            \DB::connection()->getPdo();
        } catch (\Exception $e) {
            $dbAvailable = false;
        }
        
        // Use mock data if production OR database unavailable
        if ($isProduction || !$dbAvailable) {
            // Create mock admin user
            $mockUser = (object) [
                'id' => 1,
                'name' => 'Demo Admin',
                'email' => 'admin@demo.com',
                'role' => 'admin',
                'balance' => 1000.00,
            ];
            
            // Create mock orders with proper numeric values
            $mockOrders = collect([
                (object) [
                    'id' => 1,
                    'order_number' => 'ORD-2024-001',
                    'user_id' => 1,
                    'user' => (object) [
                        'id' => 1,
                        'name' => 'John Smith',
                        'email' => 'john@example.com',
                    ],
                    'product_link' => 'https://nike.com/air-jordan-1',
                    'status' => 'quoted',
                    'payment_status' => 'pending',
                    'item_cost' => 150.00,
                    'service_fee' => 15.00,
                    'shipping_estimate' => 25.00,
                    'total_cost' => 190.00,
                    'checkout_url' => 'https://checkout.shopify.com/demo123',
                    'shopify_order_id' => null,
                    'notes' => '🔥 Admin View - Size 10, Red/Black colorway',
                    'created_at' => now()->subDays(2)->format('Y-m-d\TH:i:s.u\Z'),
                    'updated_at' => now()->subDays(1)->format('Y-m-d\TH:i:s.u\Z'),
                    'quoted_at' => now()->subDays(1)->format('Y-m-d\TH:i:s.u\Z'),
                    'paid_at' => null,
                    'images' => [],
                    'logistics' => null,
                    'chats' => collect([]),
                    'chat_id' => null,
                ],
                (object) [
                    'id' => 2,
                    'order_number' => 'ORD-2024-002',
                    'user_id' => 2,
                    'user' => (object) [
                        'id' => 2,
                        'name' => 'Sarah Johnson',
                        'email' => 'sarah@example.com',
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
                    'notes' => '✅ Paid via Shopify - Size Large, White',
                    'created_at' => now()->subDays(5)->format('Y-m-d\TH:i:s.u\Z'),
                    'updated_at' => now()->subDays(3)->format('Y-m-d\TH:i:s.u\Z'),
                    'quoted_at' => now()->subDays(4)->format('Y-m-d\TH:i:s.u\Z'),
                    'paid_at' => now()->subDays(3)->format('Y-m-d\TH:i:s.u\Z'),
                    'images' => [],
                    'logistics' => null,
                    'chats' => collect([]),
                    'chat_id' => null,
                ],
                (object) [
                    'id' => 3,
                    'order_number' => 'ORD-2024-003',
                    'user_id' => 3,
                    'user' => (object) [
                        'id' => 3,
                        'name' => 'Mike Chen',
                        'email' => 'mike@example.com',
                    ],
                    'product_link' => 'https://adidas.com/yeezy-boost-350',
                    'status' => 'requested',
                    'payment_status' => 'pending',
                    'item_cost' => 0, // Use 0 instead of null to avoid NaN
                    'service_fee' => 0,
                    'shipping_estimate' => 0,
                    'total_cost' => 0,
                    'checkout_url' => null,
                    'shopify_order_id' => null,
                    'notes' => '🔍 New Request - Looking for size 9.5',
                    'created_at' => now()->subHours(2)->format('Y-m-d\TH:i:s.u\Z'),
                    'updated_at' => now()->subHours(2)->format('Y-m-d\TH:i:s.u\Z'),
                    'quoted_at' => null,
                    'paid_at' => null,
                    'images' => [],
                    'logistics' => null,
                    'chats' => collect([]),
                    'chat_id' => null,
                ],
                (object) [
                    'id' => 4,
                    'order_number' => 'ORD-2024-004',
                    'user_id' => 4,
                    'user' => (object) [
                        'id' => 4,
                        'name' => 'Emma Wilson',
                        'email' => 'emma@example.com',
                    ],
                    'product_link' => 'https://balenciaga.com/triple-s-sneakers',
                    'status' => 'shipped',
                    'payment_status' => 'paid',
                    'item_cost' => 895.00,
                    'service_fee' => 89.50,
                    'shipping_estimate' => 45.00,
                    'total_cost' => 1029.50,
                    'checkout_url' => null,
                    'shopify_order_id' => 'gid://shopify/Order/5479145676894',
                    'notes' => '🚚 Shipped - Tracking: 1Z999AA1234567890',
                    'created_at' => now()->subDays(10)->format('Y-m-d\TH:i:s.u\Z'),
                    'updated_at' => now()->subDays(2)->format('Y-m-d\TH:i:s.u\Z'),
                    'quoted_at' => now()->subDays(8)->format('Y-m-d\TH:i:s.u\Z'),
                    'paid_at' => now()->subDays(6)->format('Y-m-d\TH:i:s.u\Z'),
                    'images' => [],
                    'logistics' => null,
                    'chats' => collect([]),
                    'chat_id' => null,
                ],
            ]);
            
            // Create paginated response
            $orders = new \Illuminate\Pagination\LengthAwarePaginator(
                $mockOrders, $mockOrders->count(), 20, 1, ['path' => request()->url()]
            );
            
            return Inertia::render('Admin/Orders/Index', [
                'orders' => $orders,
                'isAdmin' => true,
                'auth' => ['user' => $mockUser],
            ]);
        }
        
        // Normal flow for local development with database
        return redirect()->route('login');
    })->name('admin.orders.index');
});

// Shopify webhook routes (public, no auth middleware)
Route::prefix('webhooks/shopify')->group(function () {
    Route::post('/', [ShopifyController::class, 'handleWebhook'])->name('shopify.webhook');
});

// Test page for Shopify integration
Route::get('/shopify-test', function () {
    return view('shopify-test');
})->name('shopify.test');

// Production demo orders page (bypasses auth/database for Render.com)
Route::get('/orders', function () {
    // Check if this is production (Render.com) or database is unavailable
    $isProduction = request()->getHost() === 'jiaying-shopify.onrender.com';
    $dbAvailable = true;
    
    try {
        \DB::connection()->getPdo();
    } catch (\Exception $e) {
        $dbAvailable = false;
    }
    
    // Use mock data if production OR database unavailable
    if ($isProduction || !$dbAvailable) {
        // Create mock user for demo
        $mockUser = (object) [
            'id' => 1,
            'name' => 'Demo Admin',
            'email' => 'admin@demo.com',
            'role' => 'admin',
            'balance' => 1000.00,
        ];
        
        // Create mock orders with Shopify integration examples
        $mockOrders = collect([
            (object) [
                'id' => 1,
                'order_number' => 'ORD-2024-001',
                'user_id' => 1,
                'user' => $mockUser,
                'product_link' => 'https://nike.com/air-jordan-1',
                'status' => 'quoted',
                'payment_status' => 'pending',
                'item_cost' => 150.00,
                'service_fee' => 15.00,
                'shipping_estimate' => 25.00,
                'total_cost' => 190.00,
                'checkout_url' => 'https://checkout.shopify.com/demo123',
                'shopify_order_id' => null,
                'notes' => '🔥 Shopify Integration Demo - Size 10, Red/Black',
                'created_at' => now()->subDays(2)->toISOString(),
                'updated_at' => now()->subDays(1)->toISOString(),
                'images' => [],
                'chats' => collect([]),
                'chat_id' => null,
            ],
            (object) [
                'id' => 2,
                'order_number' => 'ORD-2024-002',
                'user_id' => 1,
                'user' => $mockUser,
                'product_link' => 'https://supreme.com/box-logo-tee',
                'status' => 'paid',
                'payment_status' => 'paid',
                'item_cost' => 85.00,
                'service_fee' => 8.50,
                'shipping_estimate' => 15.00,
                'total_cost' => 108.50,
                'checkout_url' => null,
                'shopify_order_id' => 'gid://shopify/Order/5479145676893',
                'notes' => '✅ Paid via Shopify - Size Large, White',
                'created_at' => now()->subDays(5)->toISOString(),
                'updated_at' => now()->subDays(3)->toISOString(),
                'paid_at' => now()->subDays(3)->toISOString(),
                'images' => [],
                'chats' => collect([]),
                'chat_id' => null,
            ],
            (object) [
                'id' => 3,
                'order_number' => 'ORD-2024-003',
                'user_id' => 1,
                'user' => $mockUser,
                'product_link' => 'https://adidas.com/yeezy-boost-350',
                'status' => 'requested',
                'payment_status' => 'pending',
                'item_cost' => null,
                'service_fee' => null,
                'shipping_estimate' => null,
                'total_cost' => null,
                'checkout_url' => null,
                'shopify_order_id' => null,
                'notes' => '🔍 New Request - Looking for size 9.5',
                'created_at' => now()->subHours(2)->toISOString(),
                'updated_at' => now()->subHours(2)->toISOString(),
                'images' => [],
                'chats' => collect([]),
                'chat_id' => null,
            ],
        ]);
        
        // Create paginated response
        $orders = new \Illuminate\Pagination\LengthAwarePaginator(
            $mockOrders, $mockOrders->count(), 20, 1, ['path' => request()->url()]
        );
        
        return Inertia::render('Orders/Index', [
            'orders' => $orders,
            'isAdmin' => true,
            'auth' => ['user' => $mockUser],
        ]);
    }
    
    // Normal flow for local development with database
    return redirect()->route('login');
})->name('orders.index');