<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class PaymentService
{
    private MembershipService $membershipService;
    private OrderService $orderService;

    public function __construct(MembershipService $membershipService, OrderService $orderService)
    {
        $this->membershipService = $membershipService;
        $this->orderService = $orderService;
    }

    public function processMembershipPayment(User $user, array $paymentData): Payment
    {
        return DB::transaction(function () use ($user, $paymentData) {
            $payment = Payment::create([
                'user_id' => $user->id,
                'type' => 'membership',
                'amount' => 9.9,
                'status' => 'pending',
                'payment_method' => $paymentData['payment_method'] ?? null,
                'metadata' => $paymentData,
            ]);

            $payment->update(['status' => 'completed']);

            $membership = $this->membershipService->createPaidMembership($user, $payment->reference);
            
            $payment->update(['membership_id' => $membership->id]);

            return $payment;
        });
    }

    public function processOrderPayment(Order $order, array $paymentData): Payment
    {
        return DB::transaction(function () use ($order, $paymentData) {
            if (!$order->canBePaid()) {
                throw new \Exception('Order cannot be paid in its current status');
            }

            $payment = Payment::create([
                'user_id' => $order->user_id,
                'order_id' => $order->id,
                'type' => 'order',
                'amount' => $order->total_cost,
                'status' => 'pending',
                'payment_method' => $paymentData['payment_method'] ?? null,
                'metadata' => $paymentData,
            ]);

            $payment->update(['status' => 'completed']);

            $this->orderService->markAsPaid($order, $payment->reference);

            return $payment;
        });
    }

    public function processDeposit(User $user, float $amount, array $paymentData): Payment
    {
        return DB::transaction(function () use ($user, $amount, $paymentData) {
            $payment = Payment::create([
                'user_id' => $user->id,
                'type' => 'deposit',
                'amount' => $amount,
                'status' => 'pending',
                'payment_method' => $paymentData['payment_method'] ?? null,
                'metadata' => $paymentData,
            ]);

            $payment->update(['status' => 'completed']);

            $user->increment('balance', $amount);

            return $payment;
        });
    }

    public function refundPayment(Payment $payment): void
    {
        if ($payment->status !== 'completed') {
            throw new \Exception('Only completed payments can be refunded');
        }

        DB::transaction(function () use ($payment) {
            $payment->update(['status' => 'refunded']);

            if ($payment->order) {
                $payment->order->update(['status' => 'refunded']);
            }

            $payment->user->increment('balance', $payment->amount);
        });
    }
}