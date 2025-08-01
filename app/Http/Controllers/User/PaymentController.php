<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    private PaymentService $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    public function index(Request $request): Response
    {
        $payments = $request->user()->payments()
            ->with(['order', 'membership'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Payments/Index', [
            'payments' => $payments,
        ]);
    }

    public function deposit(): Response
    {
        return Inertia::render('Payments/Deposit');
    }

    public function processDeposit(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:10|max:1000',
            'payment_method' => 'required|string',
        ]);

        try {
            $payment = $this->paymentService->processDeposit(
                $request->user(),
                $validated['amount'],
                ['payment_method' => $validated['payment_method']]
            );

            return redirect()->route('payments.index')
                ->with('success', 'Deposit successful!');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function payOrder(Order $order)
    {
        $this->authorize('update', $order);

        return Inertia::render('Payments/PayOrder', [
            'order' => $order,
        ]);
    }

    public function processOrderPayment(Request $request, Order $order)
    {
        $this->authorize('update', $order);

        $validated = $request->validate([
            'payment_method' => 'required|string',
        ]);

        try {
            if ($request->user()->balance >= $order->total_cost) {
                $request->user()->decrement('balance', $order->total_cost);
                $this->paymentService->processOrderPayment($order, [
                    'payment_method' => 'balance',
                ]);
            } else {
                $this->paymentService->processOrderPayment($order, $validated);
            }

            return redirect()->route('orders.show', $order)
                ->with('success', 'Payment successful!');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}