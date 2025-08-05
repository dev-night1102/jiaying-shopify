<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                \Log::error('Dashboard: No authenticated user');
                return redirect(route('login'))->with('error', 'Please log in to access dashboard.');
            }
            
            // Get stats with error handling
            $stats = [
                'totalOrders' => 0,
                'activeOrders' => 0,
                'completedOrders' => 0,
                'balance' => 0,
            ];
            
            try {
                $stats['totalOrders'] = $user->orders()->count();
                $stats['activeOrders'] = $user->orders()->whereNotIn('status', ['delivered', 'cancelled', 'refunded'])->count();
                $stats['completedOrders'] = $user->orders()->where('status', 'delivered')->count();
                $stats['balance'] = $user->balance ?? 0;
            } catch (\Exception $e) {
                \Log::warning('Dashboard: Error loading stats: ' . $e->getMessage());
            }
            
            // Get recent orders with error handling
            $recentOrders = collect([]);
            try {
                $recentOrders = $user->orders()
                    ->with(['logistics'])
                    ->latest()
                    ->take(5)
                    ->get();
            } catch (\Exception $e) {
                \Log::warning('Dashboard: Error loading recent orders: ' . $e->getMessage());
            }
            
            // Get membership with error handling
            $membership = null;
            try {
                $membership = $user->activeMembership;
            } catch (\Exception $e) {
                \Log::warning('Dashboard: Error loading membership: ' . $e->getMessage());
            }
            
            return Inertia::render('Dashboard', [
                'stats' => $stats,
                'recentOrders' => $recentOrders,
                'membership' => $membership,
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Dashboard: Fatal error - ' . $e->getMessage());
            \Log::error('Dashboard: Stack trace - ' . $e->getTraceAsString());
            
            // Return a simple response to avoid 500 error
            return Inertia::render('Dashboard', [
                'stats' => [
                    'totalOrders' => 0,
                    'activeOrders' => 0,
                    'completedOrders' => 0,
                    'balance' => 0,
                ],
                'recentOrders' => collect([]),
                'membership' => null,
                'error' => 'Dashboard data temporarily unavailable',
            ]);
        }
    }
}