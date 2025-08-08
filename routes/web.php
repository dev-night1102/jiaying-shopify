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
});