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
        $query = User::withCount('orders');
        
        // Search filter
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%");
            });
        }
        
        // Role filter
        if ($request->role) {
            $query->where('role', $request->role);
        }
        
        // Sorting
        switch ($request->sort) {
            case 'oldest':
                $query->oldest();
                break;
            case 'name':
                $query->orderBy('name');
                break;
            case 'orders':
                $query->orderBy('orders_count', 'desc');
                break;
            case 'balance':
                $query->orderBy('balance', 'desc');
                break;
            default: // latest
                $query->latest();
                break;
        }
        
        $users = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role', 'sort']),
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