<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Shopify API Configuration
    |--------------------------------------------------------------------------
    |
    | These values configure the Shopify API integration for your shopping
    | agent platform. You'll need to create a Custom App in your Shopify
    | admin panel to get these credentials.
    |
    */

    'api_version' => env('SHOPIFY_API_VERSION', '2024-01'),
    
    'store_domain' => env('SHOPIFY_STORE_DOMAIN', 'your-store.myshopify.com'),
    
    'access_token' => env('SHOPIFY_ACCESS_TOKEN', ''),
    
    'api_key' => env('SHOPIFY_API_KEY', ''),
    
    'api_secret' => env('SHOPIFY_API_SECRET', ''),
    
    'webhook_secret' => env('SHOPIFY_WEBHOOK_SECRET', ''),
    
    /*
    |--------------------------------------------------------------------------
    | Service Fee Configuration
    |--------------------------------------------------------------------------
    |
    | Configure your service fees and commission structure
    |
    */
    
    'service_fee_percentage' => env('SHOPIFY_SERVICE_FEE_PERCENTAGE', 10),
    
    'refund_fee_percentage' => env('SHOPIFY_REFUND_FEE_PERCENTAGE', 5),
    
    /*
    |--------------------------------------------------------------------------
    | Checkout Configuration
    |--------------------------------------------------------------------------
    |
    | Settings for draft order and checkout creation
    |
    */
    
    'checkout_expires_in_hours' => env('SHOPIFY_CHECKOUT_EXPIRES_IN_HOURS', 72),
    
    'checkout_note_prefix' => 'Shopping Agent Order #',
    
    /*
    |--------------------------------------------------------------------------
    | Webhook Configuration
    |--------------------------------------------------------------------------
    |
    | Webhook endpoints and topics to subscribe to
    |
    */
    
    'webhooks' => [
        'enabled' => env('SHOPIFY_WEBHOOKS_ENABLED', true),
        'topics' => [
            'orders/create',
            'orders/updated',
            'orders/paid',
            'orders/cancelled',
            'checkouts/create',
            'checkouts/update',
            'refunds/create',
        ],
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Product Configuration
    |--------------------------------------------------------------------------
    |
    | Default product settings for service fees
    |
    */
    
    'service_product' => [
        'title' => 'Shopping Agent Service Fee',
        'vendor' => 'Shopping Agent',
        'product_type' => 'Service',
        'tags' => ['service', 'fee', 'shopping-agent'],
    ],
];