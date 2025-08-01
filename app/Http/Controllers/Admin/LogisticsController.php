<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LogisticsController extends Controller
{
    public function edit(Order $order): Response
    {
        $order->load(['logistics', 'user']);

        return Inertia::render('Admin/Logistics/Edit', [
            'order' => $order,
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'tracking_number' => 'nullable|string|max:255',
            'carrier' => 'nullable|string|max:255',
            'tracking_url' => 'nullable|url',
            'actual_weight' => 'nullable|numeric|min:0',
            'actual_shipping_cost' => 'nullable|numeric|min:0',
            'warehouse_notes' => 'nullable|string|max:1000',
        ]);

        if ($order->logistics) {
            $order->logistics->update($validated);
        } else {
            $order->logistics()->create($validated);
        }

        if ($validated['tracking_number'] && $order->status !== 'shipped') {
            $order->update(['status' => 'shipped', 'shipped_at' => now()]);
        }

        return redirect()->route('admin.orders.show', $order)
            ->with('success', 'Logistics information updated successfully!');
    }
}