<?php

// Mock data for testing real-time chat without database
return [
    'users' => [
        [
            'id' => 1,
            'name' => 'Admin User',
            'email' => 'admin@test.com',
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'role' => 'admin',
            'email_verified_at' => now(),
        ],
        [
            'id' => 2,
            'name' => 'Test User',
            'email' => 'user@test.com', 
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'role' => 'user',
            'email_verified_at' => now(),
        ],
    ],
    
    'orders' => [
        [
            'id' => 1,
            'user_id' => 2,
            'order_number' => 'ORD-20250823-001',
            'product_link' => 'https://example.com/product/1',
            'notes' => 'Please check the size and color',
            'status' => 'requested',
            'created_at' => now(),
        ],
    ],
    
    'chats' => [
        [
            'id' => 1,
            'user_id' => 2,
            'order_id' => 1,
            'status' => 'active',
            'last_message_at' => now(),
        ],
    ],
    
    'messages' => [
        [
            'id' => 1,
            'chat_id' => 1,
            'sender_id' => 2,
            'content' => 'Hello! I need help with my order.',
            'type' => 'text',
            'created_at' => now()->subMinutes(10),
        ],
        [
            'id' => 2,
            'chat_id' => 1,
            'sender_id' => 1,
            'content' => 'Hi! I\'m here to help. What do you need?',
            'type' => 'text',
            'created_at' => now()->subMinutes(5),
        ],
        [
            'id' => 3,
            'chat_id' => 1,
            'sender_id' => 2,
            'content' => 'Can you check the shipping status?',
            'type' => 'text',
            'created_at' => now()->subMinutes(2),
        ],
    ],
];