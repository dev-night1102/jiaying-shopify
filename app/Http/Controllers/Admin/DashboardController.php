<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Chat;
use App\Models\Order;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalUsers' => User::where('role', 'user')->count(),
                'activeMembers' => User::whereHas('memberships', function ($query) {
                    $query->where('status', 'active')
                        ->where('expires_at', '>', now());
                })->count(),
                'pendingQuotes' => Order::where('status', 'requested')->count(),
                'activeOrders' => Order::whereIn('status', ['paid', 'purchased', 'inspected', 'shipped'])->count(),
                'totalRevenue' => Payment::where('status', 'completed')->sum('amount'),
                'monthlyRevenue' => Payment::where('status', 'completed')
                    ->whereMonth('created_at', now()->month)
                    ->sum('amount'),
                'unreadChats' => Chat::whereHas('messages', function ($query) {
                    $query->where('is_read', false)
                        ->whereHas('sender', function ($q) {
                            $q->where('role', 'user');
                        });
                })->count(),
            ],
            'recentOrders' => Order::with(['user', 'logistics'])
                ->latest()
                ->take(10)
                ->get(),
            'pendingQuotes' => Order::with('user')
                ->where('status', 'requested')
                ->oldest()
                ->take(5)
                ->get(),
        ]);
    }
}