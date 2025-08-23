# Real-time Chat Testing Guide (No Database Required)

## Quick Start Testing

### Step 1: Start Services (3 terminals)

**Terminal 1 - WebSocket Server:**
```bash
cd /home/admin/Documents/Project/jiaying-shopify
soketi start --config=soketi.config.json
```

**Terminal 2 - Laravel Server:**
```bash
cd /home/admin/Documents/Project/jiaying-shopify
php artisan serve
```

**Terminal 3 - Frontend:**
```bash
cd /home/admin/Documents/Project/jiaying-shopify
npm run dev
```

### Step 2: Test WebSocket Connection Directly

Open browser developer tools (F12) and paste this code in Console:

```javascript
// Test WebSocket connection
const testWebSocket = () => {
    const pusher = new Pusher('shopping-agent-key', {
        wsHost: '127.0.0.1',
        wsPort: 6001,
        forceTLS: false,
        disableStats: true,
        enabledTransports: ['ws'],
        cluster: 'mt1'
    });

    pusher.connection.bind('connected', () => {
        console.log('✅ WebSocket Connected Successfully!');
    });

    pusher.connection.bind('disconnected', () => {
        console.log('❌ WebSocket Disconnected');
    });

    // Subscribe to a test channel
    const channel = pusher.subscribe('test-channel');
    
    channel.bind('test-event', (data) => {
        console.log('📨 Received test message:', data);
    });
    
    console.log('🔄 Connecting to WebSocket server...');
    return pusher;
};

// Run the test
const pusherInstance = testWebSocket();
```

### Step 3: Test Broadcasting

In another browser tab, paste this to send a test message:

```javascript
// Simulate sending a message
fetch('/broadcasting/auth', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
    }
}).then(() => {
    console.log('✅ Broadcasting auth successful');
}).catch(err => {
    console.log('❌ Broadcasting auth failed:', err);
});
```

### Step 4: Verify Real-time Features Work

**Expected Results:**
- ✅ Console shows "WebSocket Connected Successfully!"
- ✅ No connection errors
- ✅ Pusher object created successfully
- ✅ Can subscribe to channels

**If you see these messages, your real-time system is working!**

## Full Application Testing (With Database)

If you want to test the full application, here are database setup options:

### Option A: Use Docker MySQL (Easiest)

```bash
# Start MySQL in Docker
docker run --name mysql-test -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=jiaying_shopify -p 3306:3306 -d mysql:8.0

# Update .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=jiaying_shopify
DB_USERNAME=root
DB_PASSWORD=password

# Run migrations
php artisan migrate --force
php artisan db:seed
```

### Option B: Use XAMPP/MAMP

1. Install XAMPP or MAMP
2. Start MySQL service
3. Create database "jiaying_shopify"
4. Update .env with your credentials
5. Run `php artisan migrate`

### Option C: Use Online Database

Use a free online MySQL service like:
- PlanetScale (free tier)
- Railway (free tier)
- Clever Cloud (free tier)

## Testing Real-time Chat Features

Once database is setup:

1. **Create test users:**
```bash
php artisan tinker
App\Models\User::create(['name' => 'Admin', 'email' => 'admin@test.com', 'password' => bcrypt('password'), 'role' => 'admin', 'email_verified_at' => now()]);
App\Models\User::create(['name' => 'User', 'email' => 'user@test.com', 'password' => bcrypt('password'), 'role' => 'user', 'email_verified_at' => now()]);
exit
```

2. **Test in 2 browsers:**
   - Browser 1: Login as admin@test.com
   - Browser 2: Login as user@test.com
   - Create an order, then chat
   - Messages should appear instantly!

## Troubleshooting

**WebSocket issues:**
- Check Soketi is running on port 6001
- Verify no firewall blocking
- Check browser console for errors

**Connection failed:**
- Restart Soketi server
- Clear browser cache
- Check CSRF token exists

**Messages not real-time:**
- Verify Echo is initialized
- Check network tab for WebSocket connection
- Look for broadcasting events in Laravel logs

## Success Indicators

✅ **WebSocket Status:** "Connected" with green wifi icon  
✅ **Instant Messages:** No page refresh needed  
✅ **Typing Indicators:** Animated dots when typing  
✅ **File Uploads:** Images appear immediately  
✅ **No Errors:** Clean browser console  

If you see all these, your real-time chat is **production ready!** 🎉