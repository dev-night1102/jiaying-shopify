<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ShopifyService;
use App\Jobs\ProcessShopifyWebhook;
use App\Models\Order;
use Illuminate\Support\Facades\Log;

class ShopifyController extends Controller
{
    protected $shopifyService;

    public function __construct(ShopifyService $shopifyService)
    {
        $this->shopifyService = $shopifyService;
    }

    /**
     * Handle incoming Shopify webhooks
     */
    public function handleWebhook(Request $request)
    {
        // Get the raw request body for HMAC verification
        $rawBody = $request->getContent();
        $hmacHeader = $request->header('X-Shopify-Hmac-Sha256');
        $topic = $request->header('X-Shopify-Topic');
        $shopDomain = $request->header('X-Shopify-Shop-Domain');
        
        // Verify webhook authenticity
        if (!$this->shopifyService->verifyWebhook($rawBody, $hmacHeader)) {
            Log::warning('Invalid Shopify webhook signature', [
                'topic' => $topic,
                'shop' => $shopDomain
            ]);
            return response('Unauthorized', 401);
        }

        // Dispatch to queue for processing
        ProcessShopifyWebhook::dispatch($topic, $request->all());

        // Log webhook receipt
        Log::info('Shopify webhook received', [
            'topic' => $topic,
            'shop' => $shopDomain
        ]);

        // Respond quickly to avoid timeout
        return response('OK', 200);
    }

    /**
     * Process order creation webhook
     */
    public function processOrderCreated($data)
    {
        $shopifyOrderId = $data['id'];
        $shopifyOrderName = $data['name'];
        
        // Find the internal order by note attributes
        $noteAttributes = collect($data['note_attributes'] ?? []);
        $internalOrderId = $noteAttributes->firstWhere('name', 'internal_order_id')['value'] ?? null;
        
        if ($internalOrderId) {
            $order = Order::find($internalOrderId);
            if ($order) {
                $order->update([
                    'shopify_order_id' => $shopifyOrderId,
                    'shopify_order_name' => $shopifyOrderName,
                    'payment_status' => 'pending',
                    'status' => 'payment_pending'
                ]);
                
                Log::info('Order linked to Shopify', [
                    'order_id' => $order->id,
                    'shopify_order_id' => $shopifyOrderId
                ]);
            }
        }
    }

    /**
     * Process order payment webhook
     */
    public function processOrderPaid($data)
    {
        $shopifyOrderId = $data['id'];
        $financialStatus = $data['financial_status'];
        
        // Find order by Shopify order ID
        $order = Order::where('shopify_order_id', $shopifyOrderId)->first();
        
        if ($order) {
            if ($financialStatus === 'paid') {
                $order->update([
                    'payment_status' => 'paid',
                    'status' => 'processing',
                    'paid_at' => now()
                ]);
                
                // Broadcast payment success event
                broadcast(new \App\Events\OrderPaid($order))->toOthers();
                
                // Send notification to admin
                $order->user->notify(new \App\Notifications\OrderPaidNotification($order));
                
                Log::info('Order payment confirmed', [
                    'order_id' => $order->id,
                    'shopify_order_id' => $shopifyOrderId
                ]);
            }
        }
    }

    /**
     * Process order cancellation webhook
     */
    public function processOrderCancelled($data)
    {
        $shopifyOrderId = $data['id'];
        $cancelReason = $data['cancel_reason'] ?? 'unknown';
        
        // Find order by Shopify order ID
        $order = Order::where('shopify_order_id', $shopifyOrderId)->first();
        
        if ($order) {
            $order->update([
                'payment_status' => 'cancelled',
                'status' => 'cancelled',
                'cancelled_at' => now(),
                'cancel_reason' => $cancelReason
            ]);
            
            // Broadcast cancellation event
            broadcast(new \App\Events\OrderCancelled($order))->toOthers();
            
            Log::info('Order cancelled via Shopify', [
                'order_id' => $order->id,
                'shopify_order_id' => $shopifyOrderId,
                'reason' => $cancelReason
            ]);
        }
    }

    /**
     * Process refund creation webhook
     */
    public function processRefundCreated($data)
    {
        $orderId = $data['order_id'];
        $refundAmount = $data['transactions'][0]['amount'] ?? 0;
        
        // Find order by Shopify order ID
        $order = Order::where('shopify_order_id', $orderId)->first();
        
        if ($order) {
            $order->update([
                'refund_status' => 'refunded',
                'refunded_amount' => $refundAmount,
                'refunded_at' => now()
            ]);
            
            // Update user balance if refund to balance
            if ($order->refund_to_balance) {
                $order->user->increment('balance', $refundAmount);
                
                // Create balance transaction record
                $order->user->balanceTransactions()->create([
                    'type' => 'refund',
                    'amount' => $refundAmount,
                    'description' => "Refund for Order #{$order->id}",
                    'order_id' => $order->id
                ]);
            }
            
            Log::info('Refund processed', [
                'order_id' => $order->id,
                'amount' => $refundAmount
            ]);
        }
    }

    /**
     * Process checkout creation webhook
     */
    public function processCheckoutCreated($data)
    {
        $checkoutToken = $data['token'];
        $checkoutUrl = $data['web_url'];
        
        // Extract internal order ID from line item properties
        $lineItems = $data['line_items'] ?? [];
        $internalOrderId = null;
        
        foreach ($lineItems as $item) {
            $properties = collect($item['properties'] ?? []);
            $orderId = $properties->firstWhere('name', 'Order ID')['value'] ?? null;
            if ($orderId) {
                $internalOrderId = $orderId;
                break;
            }
        }
        
        if ($internalOrderId) {
            $order = Order::find($internalOrderId);
            if ($order) {
                $order->update([
                    'shopify_checkout_id' => $checkoutToken,
                    'checkout_url' => $checkoutUrl,
                    'checkout_created_at' => now()
                ]);
                
                Log::info('Checkout created for order', [
                    'order_id' => $order->id,
                    'checkout_token' => $checkoutToken
                ]);
            }
        }
    }

    /**
     * Process checkout update webhook
     */
    public function processCheckoutUpdated($data)
    {
        $checkoutToken = $data['token'];
        $completedAt = $data['completed_at'] ?? null;
        
        if ($completedAt) {
            // Find order by checkout ID
            $order = Order::where('shopify_checkout_id', $checkoutToken)->first();
            
            if ($order) {
                $order->update([
                    'checkout_completed_at' => $completedAt,
                    'payment_status' => 'processing'
                ]);
                
                Log::info('Checkout completed', [
                    'order_id' => $order->id,
                    'checkout_token' => $checkoutToken
                ]);
            }
        }
    }

    /**
     * Register webhooks with Shopify (admin action)
     */
    public function registerWebhooks()
    {
        $registered = $this->shopifyService->registerWebhooks();
        
        return response()->json([
            'success' => true,
            'registered_topics' => $registered,
            'message' => 'Webhooks registered successfully'
        ]);
    }
}