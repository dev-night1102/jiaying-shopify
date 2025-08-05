<?php

namespace App\Http\Controllers;

use App\Models\Membership;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MembershipController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            $memberships = Membership::with('user')
                ->latest()
                ->paginate(20);
        } else {
            $memberships = $user->memberships()
                ->latest()
                ->paginate(10);
        }

        return Inertia::render('Memberships/Index', [
            'memberships' => $memberships,
            'isAdmin' => $user->isAdmin(),
            'membershipPlans' => $this->getMembershipPlans(),
        ]);
    }

    public function show(Request $request, Membership $membership)
    {
        $user = $request->user();

        // Check permissions
        if (!$user->isAdmin() && $membership->user_id !== $user->id) {
            abort(403);
        }

        return Inertia::render('Memberships/Show', [
            'membership' => $membership->load('user'),
            'isAdmin' => $user->isAdmin(),
        ]);
    }

    public function subscribe(Request $request)
    {
        $request->validate([
            'type' => 'required|in:trial,basic,premium,enterprise',
        ]);

        $user = $request->user();
        $plans = $this->getMembershipPlans();
        $plan = $plans[$request->type];

        // Check if user already has an active membership
        if ($user->activeMembership && $user->activeMembership->isActive()) {
            return back()->with('error', 'You already have an active membership.');
        }

        // For paid plans, check balance
        if ($plan['price'] > 0) {
            if ($user->balance < $plan['price']) {
                return back()->with('error', 'Insufficient balance. Please top up your account.');
            }
            
            // Deduct from user balance
            $user->decrement('balance', $plan['price']);
        }

        // Create membership
        Membership::create([
            'user_id' => $user->id,
            'type' => $request->type,
            'status' => 'active',
            'started_at' => now(),
            'expires_at' => now()->addDays($plan['duration_days']),
            'amount_paid' => $plan['price'],
        ]);

        return back()->with('success', "Successfully subscribed to {$plan['name']} plan!");
    }

    public function cancel(Request $request, Membership $membership)
    {
        $user = $request->user();

        // Check permissions
        if (!$user->isAdmin() && $membership->user_id !== $user->id) {
            abort(403);
        }

        if (!$membership->isActive()) {
            return back()->with('error', 'This membership is not active.');
        }

        $membership->update([
            'status' => 'cancelled',
            'expires_at' => now(), // Expire immediately
        ]);

        return back()->with('success', 'Membership cancelled successfully.');
    }

    public function extend(Request $request, Membership $membership)
    {
        if (!$request->user()->isAdmin()) {
            abort(403);
        }

        $request->validate([
            'days' => 'required|integer|min:1|max:365',
        ]);

        $membership->update([
            'expires_at' => $membership->expires_at->addDays($request->days),
        ]);

        return back()->with('success', "Membership extended by {$request->days} days.");
    }

    public function topUp(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:10|max:1000',
        ]);

        $user = $request->user();
        
        // In a real app, you'd integrate with a payment gateway here
        // For now, we'll just add the amount (this should be secured)
        $user->increment('balance', $request->amount);

        return back()->with('success', "Successfully added \${$request->amount} to your balance.");
    }

    private function getMembershipPlans(): array
    {
        return [
            'trial' => [
                'name' => 'Trial',
                'price' => 0,
                'duration_days' => 7,
                'features' => [
                    '2 orders per month',
                    'Basic support',
                    'Standard processing time',
                ],
            ],
            'basic' => [
                'name' => 'Basic',
                'price' => 29.99,
                'duration_days' => 30,
                'features' => [
                    '10 orders per month',
                    'Priority support',
                    'Fast processing time',
                    'Order tracking',
                ],
            ],
            'premium' => [
                'name' => 'Premium',
                'price' => 59.99,
                'duration_days' => 30,
                'features' => [
                    'Unlimited orders',
                    '24/7 premium support',
                    'Express processing',
                    'Advanced order tracking',
                    'Personal account manager',
                ],
            ],
            'enterprise' => [
                'name' => 'Enterprise',
                'price' => 199.99,
                'duration_days' => 30,
                'features' => [
                    'Unlimited orders',
                    'Dedicated support team',
                    'Priority processing',
                    'Custom integrations',
                    'Bulk order management',
                    'Custom reporting',
                ],
            ],
        ];
    }
}