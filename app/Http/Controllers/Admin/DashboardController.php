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
        try {
            // Basic stats
            $totalUsers = User::where('role', 'user')->count();
            $totalOrders = Order::count();
            $pendingQuotes = Order::where('status', 'requested')->count();
            $activeOrders = Order::whereIn('status', ['paid', 'purchased', 'inspected', 'shipped'])->count();
            $completedOrders = Order::where('status', 'completed')->count();
            
            // Revenue calculations with fallbacks
            $totalRevenue = 0;
            $monthlyRevenue = 0;
            try {
                // Try to get revenue from payments table, fall back to orders
                if (\Schema::hasTable('payments')) {
                    $totalRevenue = Payment::where('status', 'completed')->sum('amount') ?? 0;
                    $monthlyRevenue = Payment::where('status', 'completed')
                        ->whereMonth('created_at', now()->month)
                        ->sum('amount') ?? 0;
                } else {
                    // Fallback to orders table
                    $totalRevenue = Order::whereNotNull('total_cost')->sum('total_cost') ?? 0;
                    $monthlyRevenue = Order::whereNotNull('total_cost')
                        ->whereMonth('created_at', now()->month)
                        ->sum('total_cost') ?? 0;
                }
            } catch (\Exception $e) {
                // Use zero values if there are database issues
                $totalRevenue = 0;
                $monthlyRevenue = 0;
            }
            
            // Growth calculations
            $lastMonthUsers = User::where('role', 'user')
                ->whereMonth('created_at', now()->subMonth()->month)
                ->count();
            $userGrowth = $lastMonthUsers > 0 ? round((($totalUsers - $lastMonthUsers) / $lastMonthUsers) * 100, 1) : 0;
            
            $lastMonthOrders = Order::whereMonth('created_at', now()->subMonth()->month)->count();
            $orderGrowth = $lastMonthOrders > 0 ? round((($totalOrders - $lastMonthOrders) / $lastMonthOrders) * 100, 1) : 0;

            // Chart data - Monthly orders for the last 6 months
            $monthlyOrdersData = [];
            $monthlyRevenueData = [];
            for ($i = 5; $i >= 0; $i--) {
                $month = now()->subMonths($i);
                $monthlyOrdersData[] = [
                    'month' => $month->format('M'),
                    'orders' => Order::whereYear('created_at', $month->year)
                        ->whereMonth('created_at', $month->month)
                        ->count()
                ];
                
                $monthRevenue = 0;
                try {
                    if (\Schema::hasTable('payments')) {
                        $monthRevenue = Payment::where('status', 'completed')
                            ->whereYear('created_at', $month->year)
                            ->whereMonth('created_at', $month->month)
                            ->sum('amount') ?? 0;
                    } else {
                        $monthRevenue = Order::whereYear('created_at', $month->year)
                            ->whereMonth('created_at', $month->month)
                            ->whereNotNull('total_cost')
                            ->sum('total_cost') ?? 0;
                    }
                } catch (\Exception $e) {
                    // Use zero if there are database issues
                    $monthRevenue = 0;
                }
                
                $monthlyRevenueData[] = [
                    'month' => $month->format('M'),
                    'revenue' => $monthRevenue
                ];
            }

            return Inertia::render('Admin/Dashboard', [
                'stats' => [
                    'totalUsers' => $totalUsers,
                    'totalOrders' => $totalOrders,
                    'pendingQuotes' => $pendingQuotes,
                    'activeOrders' => $activeOrders,
                    'completedOrders' => $completedOrders,
                    'totalRevenue' => $totalRevenue,
                    'monthlyRevenue' => $monthlyRevenue,
                    'userGrowth' => $userGrowth,
                    'orderGrowth' => $orderGrowth,
                    'conversionRate' => $totalOrders > 0 ? round(($completedOrders / $totalOrders) * 100, 1) : 0,
                ],
                'chartData' => [
                    'monthlyOrders' => $monthlyOrdersData,
                    'monthlyRevenue' => $monthlyRevenueData,
                ],
                'recentOrders' => Order::with('user')
                    ->latest()
                    ->take(8)
                    ->get()
                    ->map(function ($order) {
                        return [
                            'id' => $order->id,
                            'order_number' => $order->order_number ?? '#ORD-' . str_pad($order->id, 4, '0', STR_PAD_LEFT),
                            'user_name' => $order->user->name ?? 'Unknown User',
                            'status' => $order->status,
                            'total_cost' => $order->total_cost,
                            'created_at' => $order->created_at,
                            'product_link' => $order->product_link,
                        ];
                    }),
                'pendingQuotes' => Order::with('user')
                    ->where('status', 'requested')
                    ->oldest()
                    ->take(5)
                    ->get()
                    ->map(function ($order) {
                        return [
                            'id' => $order->id,
                            'order_number' => $order->order_number ?? '#ORD-' . str_pad($order->id, 4, '0', STR_PAD_LEFT),
                            'user_name' => $order->user->name ?? 'Unknown User',
                            'product_link' => $order->product_link,
                            'created_at' => $order->created_at,
                            'days_waiting' => $order->created_at->diffInDays(now()),
                        ];
                    }),
            ]);
        } catch (\Exception $e) {
            \Log::error('Admin Dashboard: Error - ' . $e->getMessage());
            
            // Return safe defaults
            return Inertia::render('Admin/Dashboard', [
                'stats' => [
                    'totalUsers' => 0,
                    'activeMembers' => 0,
                    'pendingQuotes' => 0,
                    'activeOrders' => 0,
                    'totalRevenue' => 0,
                    'monthlyRevenue' => 0,
                    'unreadChats' => 0,
                ],
                'recentOrders' => collect([]),
                'pendingQuotes' => collect([]),
            ]);
        }
    }
}