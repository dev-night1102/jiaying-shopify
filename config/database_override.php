<?php
// Development override for database operations
// This allows the application to run without a proper database connection

return [
    'enabled' => env('DB_OVERRIDE_ENABLED', false),
    'storage_path' => storage_path('app/temp_db'),
    'tables' => [
        'users' => [],
        'memberships' => [],
        'orders' => [],
        'order_images' => [],
        'logistics' => [],
        'chats' => [],
        'messages' => [],
        'payments' => [],
    ]
];