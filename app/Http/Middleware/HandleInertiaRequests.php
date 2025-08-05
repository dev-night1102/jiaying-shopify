<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $notifications = [];
        
        try {
            if ($request->user()) {
                $user = $request->user();
                
                try {
                    if ($user->isAdmin()) {
                        // Admin notifications with error handling
                        $notifications = [
                            'unread_chats' => 0,
                            'pending_orders' => 0,
                            'quoted_orders' => 0,
                            'paid_orders' => 0,
                        ];
                        
                        try {
                            if (class_exists('\App\Models\Chat')) {
                                $notifications['unread_chats'] = \App\Models\Chat::where('status', 'active')->count();
                            }
                        } catch (\Exception $e) {
                            \Log::warning('Inertia: Chat count failed: ' . $e->getMessage());
                        }
                        
                        try {
                            if (class_exists('\App\Models\Order')) {
                                $notifications['pending_orders'] = \App\Models\Order::where('status', 'requested')->count();
                                $notifications['quoted_orders'] = \App\Models\Order::where('status', 'quoted')->count();
                                $notifications['paid_orders'] = \App\Models\Order::where('status', 'paid')->count();
                            }
                        } catch (\Exception $e) {
                            \Log::warning('Inertia: Order counts failed: ' . $e->getMessage());
                        }
                        
                    } else {
                        // User notifications with error handling
                        $notifications = [
                            'unread_chats' => 0,
                            'order_updates' => 0,
                        ];
                        
                        try {
                            if (method_exists($user, 'chats')) {
                                $notifications['unread_chats'] = $user->chats()->where('status', 'active')->count();
                            }
                        } catch (\Exception $e) {
                            \Log::warning('Inertia: User chats count failed: ' . $e->getMessage());
                        }
                        
                        try {
                            if (method_exists($user, 'orders')) {
                                $notifications['order_updates'] = $user->orders()
                                    ->whereIn('status', ['quoted', 'purchased', 'inspected', 'shipped'])
                                    ->count();
                            }
                        } catch (\Exception $e) {
                            \Log::warning('Inertia: User orders count failed: ' . $e->getMessage());
                        }
                    }
                } catch (\Exception $e) {
                    \Log::warning('Inertia: Notification loading failed: ' . $e->getMessage());
                }
            }
        } catch (\Exception $e) {
            \Log::error('Inertia: User data loading failed: ' . $e->getMessage());
        }

        // Safe user data extraction
        $userData = null;
        try {
            if ($request->user()) {
                $user = $request->user();
                $userData = [
                    'id' => $user->id ?? null,
                    'name' => $user->name ?? '',
                    'email' => $user->email ?? '',
                    'role' => $user->role ?? 'user',
                    'balance' => $user->balance ?? 0,
                    'language' => $user->language ?? 'en',
                    'membership' => null,
                ];
                
                // Try to get membership safely
                try {
                    if (method_exists($user, 'activeMembership') && $user->activeMembership) {
                        $membership = $user->activeMembership;
                        $userData['membership'] = [
                            'type' => $membership->type ?? 'trial',
                            'expires_at' => $membership->expires_at ?? null,
                            'days_remaining' => method_exists($membership, 'daysRemaining') ? $membership->daysRemaining() : 0,
                        ];
                    }
                } catch (\Exception $e) {
                    \Log::warning('Inertia: Membership data failed: ' . $e->getMessage());
                }
            }
        } catch (\Exception $e) {
            \Log::error('Inertia: User data extraction failed: ' . $e->getMessage());
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $userData,
            ],
            'notifications' => $notifications,
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'warning' => $request->session()->get('warning'),
                'info' => $request->session()->get('info'),
            ],
            'locale' => app()->getLocale(),
        ];
    }
}
