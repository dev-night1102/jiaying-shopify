<?php

use App\Http\Controllers\Auth\EmailVerificationController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\User\ChatController;
use App\Http\Controllers\User\MembershipController;
use App\Http\Controllers\User\OrderController;
use App\Http\Controllers\User\PaymentController;
use App\Http\Controllers\Admin;
use App\Http\Controllers\LanguageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
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
    Route::get('verify-email', [EmailVerificationController::class, 'notice'])->name('verification.notice');
    Route::get('verify-email/{id}/{hash}', [EmailVerificationController::class, 'verify'])
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');
    Route::post('email/verification-notification', [EmailVerificationController::class, 'resend'])
        ->middleware('throttle:6,1')
        ->name('verification.send');
    
    Route::post('logout', [LoginController::class, 'destroy'])->name('logout');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    Route::resource('orders', OrderController::class);
    Route::post('orders/{order}/accept-quote', [OrderController::class, 'acceptQuote'])->name('orders.accept-quote');
    Route::post('orders/{order}/reject-quote', [OrderController::class, 'rejectQuote'])->name('orders.reject-quote');
    
    Route::get('membership', [MembershipController::class, 'index'])->name('membership.index');
    Route::get('membership/plans', [MembershipController::class, 'plans'])->name('membership.plans');
    Route::post('membership/subscribe', [MembershipController::class, 'subscribe'])->name('membership.subscribe');
    
    Route::resource('chats', ChatController::class)->only(['index', 'show', 'create', 'store']);
    Route::post('chats/{chat}/messages', [ChatController::class, 'sendMessage'])->name('chats.send-message');
    
    Route::get('payments', [PaymentController::class, 'index'])->name('payments.index');
    Route::get('payments/deposit', [PaymentController::class, 'deposit'])->name('payments.deposit');
    Route::post('payments/deposit', [PaymentController::class, 'processDeposit'])->name('payments.process-deposit');
    Route::get('orders/{order}/pay', [PaymentController::class, 'payOrder'])->name('payments.pay-order');
    Route::post('orders/{order}/pay', [PaymentController::class, 'processOrderPayment'])->name('payments.process-order');
});

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->as('admin.')->group(function () {
    Route::get('/dashboard', [Admin\DashboardController::class, 'index'])->name('dashboard');
    
    Route::resource('orders', Admin\OrderController::class)->only(['index', 'show']);
    Route::get('orders/{order}/quote', [Admin\OrderController::class, 'quote'])->name('orders.quote');
    Route::post('orders/{order}/quote', [Admin\OrderController::class, 'sendQuote'])->name('orders.send-quote');
    Route::post('orders/{order}/status', [Admin\OrderController::class, 'updateStatus'])->name('orders.update-status');
    Route::post('orders/{order}/inspection-photos', [Admin\OrderController::class, 'uploadInspectionPhotos'])->name('orders.inspection-photos');
    
    Route::get('orders/{order}/logistics', [Admin\LogisticsController::class, 'edit'])->name('logistics.edit');
    Route::put('orders/{order}/logistics', [Admin\LogisticsController::class, 'update'])->name('logistics.update');
    
    Route::resource('chats', Admin\ChatController::class)->only(['index', 'show']);
    Route::post('chats/{chat}/messages', [Admin\ChatController::class, 'sendMessage'])->name('chats.send-message');
    Route::post('chats/{chat}/close', [Admin\ChatController::class, 'close'])->name('chats.close');
    
    Route::resource('users', Admin\UserController::class)->only(['index', 'show']);
    Route::post('users/{user}/balance', [Admin\UserController::class, 'updateBalance'])->name('users.update-balance');
});