# Nodemailer Email Service Setup

## Quick Setup (5 minutes)

### 1. Configure Gmail
1. Go to your Gmail account
2. Enable 2-factor authentication (if not already enabled)
3. Generate app password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail"
   - Generate password (16 characters)

### 2. Setup Email Service
```bash
cd email-service
cp .env.example .env
```

Edit `.env`:
```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
FROM_NAME=Shopping Agent
PORT=3001
```

### 3. Start Services

**Terminal 1 - Email Service:**
```bash
cd email-service
npm start
```

**Terminal 2 - Laravel:**
```bash
cd ..
php artisan serve
```

## How It Works

1. **User registers** → Laravel creates verification code
2. **Laravel calls** → `http://localhost:3001/send-verification`
3. **Nodemailer sends** → Real email to user's inbox
4. **User receives** → 6-digit code in their email
5. **User enters code** → Verified!

## Benefits

✅ **Works with ANY email** - No restrictions!
✅ **Real inbox delivery** - Gmail's reliable servers
✅ **Simple setup** - Just Gmail + app password
✅ **No domain verification** - Works immediately
✅ **Free** - No API limits

## Production Deployment

For production, update Laravel code to use environment variable:
```php
Http::post(env('EMAIL_SERVICE_URL', 'http://localhost:3001') . '/send-verification', [...])
```

Then deploy email service separately and update `EMAIL_SERVICE_URL` in `.env`.

## Test Email Service

```bash
curl -X POST http://localhost:3001/send-verification \
  -H "Content-Type: application/json" \
  -d '{"email": "test@gmail.com", "code": "123456"}'
```

## That's it! 

Your verification system now sends real emails to any address! 🎉