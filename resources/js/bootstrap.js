/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

// Configure Echo with Soketi (self-hosted Pusher replacement)
// Detect if we're in production (Render.com) or if WebSocket should be disabled
const isProduction = window.location.hostname.includes('onrender.com');
const disableWebSocket = true; // Disable WebSocket for now since Soketi server is not running

// Only initialize Echo if WebSocket is enabled and not in production
if (!isProduction && !disableWebSocket) {
    window.Echo = new Echo({
        broadcaster: 'pusher',
        key: import.meta.env.VITE_PUSHER_APP_KEY || 'shopping-agent-key',
        wsHost: import.meta.env.VITE_PUSHER_HOST || '127.0.0.1',
        wsPort: import.meta.env.VITE_PUSHER_PORT || 6001,
        forceTLS: false,
        disableStats: true,
        enabledTransports: ['ws'],
        cluster: 'mt1',
        auth: {
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
        },
    });
} else {
    // Create a mock Echo object for production to prevent errors
    window.Echo = {
        channel: () => ({
            listen: () => ({ listen: () => ({}) }),
            whisper: () => ({}),
            stopListening: () => ({})
        }),
        private: () => ({
            listen: () => ({ listen: () => ({}) }),
            whisper: () => ({}),
            stopListening: () => ({})
        }),
        leave: () => ({}),
        leaveChannel: () => ({}),
        disconnect: () => ({})
    };
    console.info('WebSocket disabled in production - Soketi server not deployed');
}
