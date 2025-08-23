#!/usr/bin/env node

// Simple WebSocket test for Soketi
const WebSocket = require('ws');

console.log('🧪 Testing WebSocket Connection to Soketi...');

const ws = new WebSocket('ws://127.0.0.1:6001/app/shopping-agent-key?protocol=7&client=js&version=4.3.1&flash=false');

ws.on('open', function() {
    console.log('✅ SUCCESS: Connected to Soketi WebSocket server!');
    
    // Test subscription to a channel
    const subscribeMessage = JSON.stringify({
        event: 'pusher:subscribe',
        data: {
            channel: 'test-channel'
        }
    });
    
    ws.send(subscribeMessage);
    console.log('📡 Sent channel subscription request');
    
    // Test sending a message after 1 second
    setTimeout(() => {
        const testMessage = JSON.stringify({
            event: 'client-test-event',
            channel: 'test-channel',
            data: {
                message: 'Hello from API test!',
                timestamp: new Date().toISOString()
            }
        });
        
        ws.send(testMessage);
        console.log('📤 Sent test message');
    }, 1000);
    
    // Close connection after 3 seconds
    setTimeout(() => {
        ws.close();
        console.log('🔚 Test completed successfully!');
        process.exit(0);
    }, 3000);
});

ws.on('message', function(data) {
    const message = JSON.parse(data);
    console.log('📨 Received:', message);
});

ws.on('error', function(error) {
    console.error('❌ WebSocket Error:', error);
    process.exit(1);
});

ws.on('close', function() {
    console.log('🔌 WebSocket connection closed');
});