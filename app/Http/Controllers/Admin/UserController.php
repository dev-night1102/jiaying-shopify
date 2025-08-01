<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $users = User::withCount('orders')
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'membership']),
        ]);
    }

    public function show(User $user): Response
    {
        $user->loadCount('orders');
        $recentOrders = $user->orders()->latest()->take(5)->get();
        
        return Inertia::render('Admin/Users/Show', [
            'user' => array_merge($user->toArray(), [
                'recent_orders' => $recentOrders,
                'recent_payments' => [], // Add when payment system is implemented
            ]),
        ]);
    }

    public function updateBalance(Request $request, User $user)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric',
            'action' => 'required|in:add,subtract',
            'description' => 'nullable|string',
        ]);

        if ($validated['action'] === 'add') {
            $user->increment('balance', $validated['amount']);
        } else {
            $user->decrement('balance', $validated['amount']);
        }

        return back()->with('success', 'Balance updated successfully!');
    }
}