<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        
        return Inertia::render('Dashboard', [
            'stats' => [
                'totalOrders' => $user->orders()->count(),
                'activeOrders' => $user->orders()->whereNotIn('status', ['delivered', 'cancelled', 'refunded'])->count(),
                'completedOrders' => $user->orders()->where('status', 'delivered')->count(),
                'balance' => $user->balance,
            ],
            'recentOrders' => $user->orders()
                ->with(['logistics'])
                ->latest()
                ->take(5)
                ->get(),
            'membership' => $user->activeMembership,
        ]);
    }
}