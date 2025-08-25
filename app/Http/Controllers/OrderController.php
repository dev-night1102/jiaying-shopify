<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderImage;
use App\Models\Chat;
use App\Services\ShopifyService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    protected $shopifyService;

    public function __construct(ShopifyService $shopifyService)
    {
        $this->shopifyService = $shopifyService;
    }
    public function index(Request $request)
    {
        $user = $request->user();
        
        $query = Order::with(['user', 'images', 'logistics', 'chats']);

        if (!$user->isAdmin()) {
            $query->where('user_id', $user->id);
        }

        $orders = $query->latest()->paginate(20);

        // Add chat_id to each order for easy access
        $orders->transform(function ($order) {
            $order->chat_id = $order->chats->first()?->id;
            return $order;
        });

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
            'isAdmin' => $user->isAdmin(),
        ]);
    }

    public function show(Request $request, $orderId)
    {
        $user = $request->user();
        
        $order = Order::with(['user', 'images', 'logistics', 'chats.messages.sender'])->findOrFail($orderId);
        
        // Check permissions
        if (!$user->isAdmin() && $order->user_id !== $user->id) {
            abort(403);
        }

        return Inertia::render('Orders/Show', [
            'order' => $order,
            'isAdmin' => $user->isAdmin(),
        ]);
    }
    public function create(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return redirect()->route('login')->with('error', 'Please log in to create an order');
            }
            
            // Only non-admin users can create orders
            if ($user->isAdmin()) {
                return redirect()->route('dashboard')->with('error', 'Admins cannot create orders');
            }

            return Inertia::render('Orders/Create', [
                'user' => $user,
            ]);
        } catch (\Exception $e) {
            Log::error('Order create page error: ' . $e->getMessage());
            
            // Return error page or redirect
            return back()->with('error', 'Unable to load order creation page. Please try again.');
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_link' => 'required|url',
            'notes' => 'nullable|string|max:1000',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|max:5120', // 5MB to match frontend
        ]);

        $user = $request->user();

        // Create order
        $order = Order::create([
            'user_id' => $user->id,
            'product_link' => $request->product_link,
            'notes' => $request->notes,
            'status' => 'requested',
        ]);

        // Handle image uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('order-images', 'public');
                OrderImage::create([
                    'order_id' => $order->id,
                    'image_path' => $path,
                ]);
            }
        }

        // Create initial chat for this order
        Chat::create([
            'user_id' => $user->id,
            'order_id' => $order->id,
            'status' => 'active',
            'last_message_at' => now(),
        ]);

        return redirect()->route('orders.show', $order)->with('success', 'Order created successfully!');
    }

    public function quote(Request $request, Order $order)
    {
        if (!$request->user()->isAdmin()) {
            abort(403);
        }

        $request->validate([
            'item_cost' => 'required|numeric|min:0',
            'service_fee' => 'required|numeric|min:0',
            'shipping_estimate' => 'required|numeric|min:0',
            'notes' => 'nullable|string|max:500',
            'items' => 'nullable|array',
            'items.*.name' => 'required_with:items|string',
            'items.*.price' => 'required_with:items|numeric',
            'items.*.quantity' => 'required_with:items|numeric',
        ]);

        if (!$order->canBeQuoted()) {
            return back()->with('error', 'This order cannot be quoted.');
        }

        // Update basic order information
        $order->update([
            'item_cost' => $request->item_cost,
            'service_fee' => $request->service_fee,
            'shipping_estimate' => $request->shipping_estimate,
            'status' => 'quoted',
            'quoted_at' => now(),
        ]);

        $order->calculateTotalCost();
        $order->save();

        // Create Shopify checkout for this quote
        $items = $request->items ?? [
            [
                'name' => 'Product from ' . $order->product_link,
                'price' => $request->item_cost,
                'quantity' => 1,
                'url' => $order->product_link
            ]
        ];

        $shopifyResult = $this->shopifyService->createDraftOrderForQuote(
            $order, 
            $items, 
            $request->service_fee
        );

        if ($shopifyResult['success']) {
            $order->update([
                'shopify_draft_order_id' => $shopifyResult['draft_order_id'],
                'checkout_url' => $shopifyResult['checkout_url'],
                'payment_status' => 'pending',
                'checkout_created_at' => now(),
            ]);

            Log::info('Shopify checkout created for order', [
                'order_id' => $order->id,
                'draft_order_id' => $shopifyResult['draft_order_id']
            ]);

            return back()->with('success', 'Quote sent with Shopify payment link!');
        } else {
            Log::error('Failed to create Shopify checkout', [
                'order_id' => $order->id,
                'error' => $shopifyResult['error']
            ]);

            return back()->with('warning', 'Quote sent, but payment integration failed. Manual payment required.');
        }
    }

    public function accept(Request $request, $orderId)
    {
        $user = $request->user();
        
        $order = Order::findOrFail($orderId);
        
        // Check permissions
        if (!$user->isAdmin() && $order->user_id !== $user->id) {
            abort(403);
        }

        if (!$order->canBeAccepted()) {
            return back()->with('error', 'This order cannot be accepted.');
        }

        $order->update([
            'status' => 'accepted',
        ]);

        return back()->with('success', 'Order accepted! Please proceed with payment.');
    }

    public function pay(Request $request, Order $order)
    {
        $user = $request->user();

        // Check permissions
        if ($order->user_id !== $user->id) {
            abort(403);
        }

        if (!$order->canBePaid()) {
            return back()->with('error', 'This order cannot be paid.');
        }

        // If Shopify checkout exists, redirect to checkout URL
        if ($order->checkout_url && $order->payment_status === 'pending') {
            return redirect($order->checkout_url);
        }

        // Fallback to balance payment for legacy orders
        if ($user->balance < $order->total_cost) {
            return back()->with('error', 'Insufficient balance. Please top up your account or use Shopify checkout.');
        }

        // Deduct from user balance
        $user->decrement('balance', $order->total_cost);

        $order->update([
            'status' => 'paid',
            'payment_status' => 'paid',
            'paid_at' => now(),
        ]);

        return back()->with('success', 'Payment successful! Your order is being processed.');
    }

    public function updateStatus(Request $request, Order $order)
    {
        if (!$request->user()->isAdmin()) {
            abort(403);
        }

        $request->validate([
            'status' => 'required|in:requested,quoted,accepted,paid,purchased,inspected,shipped,delivered,cancelled,refunded',
            'notes' => 'nullable|string|max:500',
        ]);

        $statusField = null;
        switch ($request->status) {
            case 'purchased':
                $statusField = 'purchased_at';
                break;
            case 'shipped':
                $statusField = 'shipped_at';
                break;
            case 'delivered':
                $statusField = 'delivered_at';
                break;
        }

        $updateData = ['status' => $request->status];
        if ($statusField) {
            $updateData[$statusField] = now();
        }

        $order->update($updateData);

        return back()->with('success', 'Order status updated successfully!');
    }
}