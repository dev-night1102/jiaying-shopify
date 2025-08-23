<?php

namespace App\Services;

use Shopify\Clients\Rest;
use Shopify\Context;
use Shopify\Auth\FileSessionStorage;
use Shopify\ApiVersion;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Exception;

class ShopifyService
{
    private $client;
    private $storeUrl;

    public function __construct()
    {
        // Initialize Shopify Context
        Context::initialize(
            apiKey: config('shopify.api_key'),
            apiSecretKey: config('shopify.api_secret'),
            scopes: ['read_products', 'write_products', 'read_orders', 'write_orders', 'write_draft_orders', 'read_checkouts', 'write_checkouts'],
            hostName: config('app.url'),
            sessionStorage: new FileSessionStorage('/tmp/shopify_sessions'),
            apiVersion: ApiVersion::LATEST,
            isPrivateApp: true,
        );

        $this->storeUrl = config('shopify.store_domain');
        $this->client = new Rest($this->storeUrl, config('shopify.access_token'));
    }

    /**
     * Create a draft order with service fees for an order quote
     */
    public function createDraftOrderForQuote(Order $order, array $items, float $serviceFee)
    {
        try {
            // Build line items for the draft order
            $lineItems = [];
            
            // Add product items
            foreach ($items as $item) {
                $lineItems[] = [
                    'title' => $item['name'],
                    'price' => $item['price'],
                    'quantity' => $item['quantity'],
                    'properties' => [
                        ['name' => 'Product URL', 'value' => $item['url'] ?? ''],
                        ['name' => 'Size', 'value' => $item['size'] ?? ''],
                        ['name' => 'Color', 'value' => $item['color'] ?? ''],
                    ]
                ];
            }
            
            // Add service fee as a line item
            if ($serviceFee > 0) {
                $lineItems[] = [
                    'title' => config('shopify.service_product.title'),
                    'price' => $serviceFee,
                    'quantity' => 1,
                    'properties' => [
                        ['name' => 'Order ID', 'value' => $order->id],
                        ['name' => 'Fee Type', 'value' => 'Service Fee'],
                        ['name' => 'Percentage', 'value' => config('shopify.service_fee_percentage') . '%'],
                    ]
                ];
            }

            // Create draft order
            $draftOrderData = [
                'draft_order' => [
                    'line_items' => $lineItems,
                    'customer' => [
                        'id' => $this->getOrCreateShopifyCustomer($order->user)
                    ],
                    'note' => config('shopify.checkout_note_prefix') . $order->id,
                    'tags' => 'shopping-agent, order-' . $order->id,
                    'email' => $order->user->email,
                    'phone' => $order->user->phone ?? null,
                    'shipping_address' => [
                        'first_name' => $order->user->first_name ?? $order->user->name,
                        'last_name' => $order->user->last_name ?? '',
                        'address1' => $order->shipping_address ?? '',
                        'city' => $order->shipping_city ?? '',
                        'province' => $order->shipping_state ?? '',
                        'country' => $order->shipping_country ?? 'US',
                        'zip' => $order->shipping_zip ?? '',
                    ],
                    'note_attributes' => [
                        ['name' => 'internal_order_id', 'value' => $order->id],
                        ['name' => 'order_type', 'value' => 'shopping_agent'],
                    ]
                ]
            ];

            $response = $this->client->post('draft_orders', $draftOrderData);
            
            if ($response->getStatusCode() === 201) {
                $draftOrder = $response->getDecodedBody()['draft_order'];
                
                // Get the invoice/checkout URL
                $invoiceResponse = $this->client->post("draft_orders/{$draftOrder['id']}/send_invoice", [
                    'draft_order_invoice' => [
                        'to' => $order->user->email,
                        'subject' => "Invoice for Order #{$order->id}",
                        'custom_message' => "Please complete your payment for your shopping agent order."
                    ]
                ]);
                
                return [
                    'success' => true,
                    'draft_order_id' => $draftOrder['id'],
                    'checkout_url' => $draftOrder['invoice_url'],
                    'total_price' => $draftOrder['total_price'],
                    'shopify_order_name' => $draftOrder['name'],
                ];
            }
            
            throw new Exception('Failed to create draft order');
            
        } catch (Exception $e) {
            Log::error('Shopify Draft Order Creation Failed', [
                'order_id' => $order->id,
                'error' => $e->getMessage()
            ]);
            
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Get or create a Shopify customer for a user
     */
    private function getOrCreateShopifyCustomer(User $user)
    {
        try {
            // Search for existing customer by email
            $searchResponse = $this->client->get('customers/search', [], [
                'query' => "email:{$user->email}"
            ]);
            
            $customers = $searchResponse->getDecodedBody()['customers'] ?? [];
            
            if (!empty($customers)) {
                return $customers[0]['id'];
            }
            
            // Create new customer
            $customerData = [
                'customer' => [
                    'email' => $user->email,
                    'first_name' => $user->first_name ?? $user->name,
                    'last_name' => $user->last_name ?? '',
                    'phone' => $user->phone ?? null,
                    'verified_email' => true,
                    'tags' => 'shopping-agent',
                    'note' => 'Shopping Agent Platform User',
                ]
            ];
            
            $createResponse = $this->client->post('customers', $customerData);
            $customer = $createResponse->getDecodedBody()['customer'];
            
            return $customer['id'];
            
        } catch (Exception $e) {
            Log::warning('Could not get/create Shopify customer', [
                'user_id' => $user->id,
                'error' => $e->getMessage()
            ]);
            
            return null;
        }
    }

    /**
     * Complete a draft order (convert to order)
     */
    public function completeDraftOrder($draftOrderId)
    {
        try {
            $response = $this->client->put("draft_orders/{$draftOrderId}/complete");
            
            if ($response->getStatusCode() === 200) {
                $order = $response->getDecodedBody()['draft_order'];
                
                return [
                    'success' => true,
                    'order_id' => $order['order_id'],
                    'order_name' => $order['name'],
                ];
            }
            
            throw new Exception('Failed to complete draft order');
            
        } catch (Exception $e) {
            Log::error('Shopify Draft Order Completion Failed', [
                'draft_order_id' => $draftOrderId,
                'error' => $e->getMessage()
            ]);
            
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Get order details from Shopify
     */
    public function getOrder($orderId)
    {
        try {
            $response = $this->client->get("orders/{$orderId}");
            
            if ($response->getStatusCode() === 200) {
                return $response->getDecodedBody()['order'];
            }
            
            return null;
            
        } catch (Exception $e) {
            Log::error('Failed to get Shopify order', [
                'order_id' => $orderId,
                'error' => $e->getMessage()
            ]);
            
            return null;
        }
    }

    /**
     * Cancel an order in Shopify
     */
    public function cancelOrder($orderId, $reason = 'customer')
    {
        try {
            $response = $this->client->post("orders/{$orderId}/cancel", [
                'cancel' => [
                    'reason' => $reason,
                    'email' => true,
                    'restock' => false,
                ]
            ]);
            
            if ($response->getStatusCode() === 200) {
                return [
                    'success' => true,
                    'order' => $response->getDecodedBody()['order']
                ];
            }
            
            throw new Exception('Failed to cancel order');
            
        } catch (Exception $e) {
            Log::error('Shopify Order Cancellation Failed', [
                'order_id' => $orderId,
                'error' => $e->getMessage()
            ]);
            
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Create a refund for an order
     */
    public function createRefund($orderId, $amount, $reason = 'Customer request', $note = '')
    {
        try {
            // Calculate refund with fee deduction
            $refundFeePercentage = config('shopify.refund_fee_percentage', 5);
            $refundFee = $amount * ($refundFeePercentage / 100);
            $refundAmount = $amount - $refundFee;
            
            $refundData = [
                'refund' => [
                    'currency' => 'USD',
                    'notify' => true,
                    'note' => $note ?: "Refund processed with {$refundFeePercentage}% fee",
                    'shipping' => [
                        'full_refund' => false,
                        'amount' => '0.00'
                    ],
                    'refund_line_items' => [],
                    'transactions' => [
                        [
                            'kind' => 'refund',
                            'gateway' => 'manual',
                            'amount' => $refundAmount
                        ]
                    ]
                ]
            ];
            
            $response = $this->client->post("orders/{$orderId}/refunds", $refundData);
            
            if ($response->getStatusCode() === 201) {
                $refund = $response->getDecodedBody()['refund'];
                
                return [
                    'success' => true,
                    'refund_id' => $refund['id'],
                    'refund_amount' => $refundAmount,
                    'fee_amount' => $refundFee,
                    'original_amount' => $amount,
                ];
            }
            
            throw new Exception('Failed to create refund');
            
        } catch (Exception $e) {
            Log::error('Shopify Refund Creation Failed', [
                'order_id' => $orderId,
                'amount' => $amount,
                'error' => $e->getMessage()
            ]);
            
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Verify webhook signature
     */
    public function verifyWebhook($data, $hmacHeader)
    {
        $calculatedHmac = base64_encode(hash_hmac('sha256', $data, config('shopify.webhook_secret'), true));
        
        return hash_equals($calculatedHmac, $hmacHeader);
    }

    /**
     * Register webhooks with Shopify
     */
    public function registerWebhooks()
    {
        $webhookUrl = config('app.url') . '/webhooks/shopify';
        $topics = config('shopify.webhooks.topics', []);
        
        $registered = [];
        
        foreach ($topics as $topic) {
            try {
                $response = $this->client->post('webhooks', [
                    'webhook' => [
                        'topic' => $topic,
                        'address' => $webhookUrl,
                        'format' => 'json'
                    ]
                ]);
                
                if ($response->getStatusCode() === 201) {
                    $registered[] = $topic;
                }
            } catch (Exception $e) {
                Log::warning("Failed to register webhook for topic: {$topic}", [
                    'error' => $e->getMessage()
                ]);
            }
        }
        
        return $registered;
    }

    /**
     * Get checkout by ID
     */
    public function getCheckout($checkoutId)
    {
        try {
            $response = $this->client->get("checkouts/{$checkoutId}");
            
            if ($response->getStatusCode() === 200) {
                return $response->getDecodedBody()['checkout'];
            }
            
            return null;
            
        } catch (Exception $e) {
            Log::error('Failed to get Shopify checkout', [
                'checkout_id' => $checkoutId,
                'error' => $e->getMessage()
            ]);
            
            return null;
        }
    }
}