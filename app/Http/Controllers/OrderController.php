<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    private OrderService $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function index(Request $request): Response
    {
        $orders = $request->user()->orders()
            ->with(['logistics', 'images'])
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate(10);

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Orders/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_link' => 'required|url',
            'notes' => 'nullable|string|max:1000',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|max:5120',
        ]);

        $order = $this->orderService->createOrder($request->user(), $validated);

        return redirect()->route('orders.show', $order)
            ->with('success', 'Order submitted successfully. We will provide a quote soon.');
    }

    public function show(Order $order): Response
    {
        $this->authorize('view', $order);

        $order->load(['images', 'logistics', 'chats.lastMessage', 'payments']);

        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }

    public function acceptQuote(Order $order)
    {
        $this->authorize('update', $order);

        try {
            $this->orderService->acceptQuote($order);
            return back()->with('success', 'Quote accepted. Please proceed with payment.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function rejectQuote(Order $order)
    {
        $this->authorize('update', $order);

        try {
            $this->orderService->rejectQuote($order);
            return back()->with('success', 'Quote rejected.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}