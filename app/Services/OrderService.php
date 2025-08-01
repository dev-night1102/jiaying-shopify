<?php

namespace App\Services;

use App\Models\Order;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class OrderService
{
    public function createOrder(User $user, array $data): Order
    {
        return DB::transaction(function () use ($user, $data) {
            $order = $user->orders()->create([
                'product_link' => $data['product_link'],
                'notes' => $data['notes'] ?? null,
                'status' => 'requested',
            ]);

            if (!empty($data['images'])) {
                foreach ($data['images'] as $image) {
                    if ($image instanceof UploadedFile) {
                        $this->attachImage($order, $image);
                    }
                }
            }

            return $order;
        });
    }

    public function provideQuote(Order $order, array $costs): Order
    {
        if (!$order->canBeQuoted()) {
            throw new \Exception('Order cannot be quoted in its current status');
        }

        $order->update([
            'item_cost' => $costs['item_cost'],
            'service_fee' => $costs['service_fee'],
            'shipping_estimate' => $costs['shipping_estimate'],
            'quoted_at' => now(),
            'status' => 'quoted',
        ]);

        $order->calculateTotalCost();
        $order->save();

        return $order;
    }

    public function acceptQuote(Order $order): void
    {
        if (!$order->canBeAccepted()) {
            throw new \Exception('Quote cannot be accepted in its current status');
        }

        $order->update(['status' => 'accepted']);
    }

    public function rejectQuote(Order $order): void
    {
        if (!$order->canBeAccepted()) {
            throw new \Exception('Quote cannot be rejected in its current status');
        }

        $order->update(['status' => 'rejected']);
    }

    public function markAsPaid(Order $order, string $paymentReference): void
    {
        if (!$order->canBePaid()) {
            throw new \Exception('Order cannot be marked as paid in its current status');
        }

        $order->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        $order->payments()->create([
            'user_id' => $order->user_id,
            'type' => 'order',
            'amount' => $order->total_cost,
            'status' => 'completed',
            'reference' => $paymentReference,
        ]);
    }

    public function updateStatus(Order $order, string $status, array $additionalData = []): void
    {
        $updateData = ['status' => $status];

        switch ($status) {
            case 'purchased':
                $updateData['purchased_at'] = now();
                break;
            case 'shipped':
                $updateData['shipped_at'] = now();
                break;
            case 'delivered':
                $updateData['delivered_at'] = now();
                break;
        }

        $order->update(array_merge($updateData, $additionalData));
    }

    public function attachImage(Order $order, UploadedFile $image, string $type = 'product'): void
    {
        $path = $image->store('orders/' . $order->id, 'public');
        
        $order->images()->create([
            'type' => $type,
            'path' => $path,
            'filename' => $image->getClientOriginalName(),
            'mime_type' => $image->getMimeType(),
            'size' => $image->getSize(),
        ]);
    }
}