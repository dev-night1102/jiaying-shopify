<?php

namespace App\Http\Controllers\Admin;

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
        $orders = Order::with(['user', 'logistics'])
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('order_number', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            })
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load(['user', 'images', 'logistics', 'chats.lastMessage', 'payments']);

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
        ]);
    }

    public function quote(Order $order): Response
    {
        return Inertia::render('Admin/Orders/Quote', [
            'order' => $order->load(['user', 'images']),
        ]);
    }

    public function sendQuote(Request $request, Order $order)
    {
        $validated = $request->validate([
            'item_cost' => 'required|numeric|min:0',
            'service_fee' => 'required|numeric|min:0',
            'shipping_estimate' => 'required|numeric|min:0',
        ]);

        try {
            $this->orderService->provideQuote($order, $validated);
            return redirect()->route('admin.orders.show', $order)
                ->with('success', 'Quote sent successfully!');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:purchased,inspected,shipped,delivered,cancelled',
        ]);

        try {
            $this->orderService->updateStatus($order, $validated['status']);
            return back()->with('success', 'Order status updated successfully!');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function uploadInspectionPhotos(Request $request, Order $order)
    {
        $validated = $request->validate([
            'images' => 'required|array|max:10',
            'images.*' => 'image|max:5120',
        ]);

        foreach ($validated['images'] as $image) {
            $this->orderService->attachImage($order, $image, 'inspection');
        }

        return back()->with('success', 'Inspection photos uploaded successfully!');
    }
}