# Deployment Guide for Render.com

## Required Environment Variables

Add these environment variables in your Render dashboard:

### Application Settings
```
APP_NAME=Shopping Agent
APP_ENV=production
APP_KEY=base64:tIyoubOMta057Bc4dPf6RVoMxFyVO1UxME/+zwjTbec=
APP_DEBUG=false
APP_URL=https://jiaying-shopify.onrender.com
```

### Database (SQLite)
```
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

### Email Configuration (Gmail SMTP)
```
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=sonhuang4@gmail.com
MAIL_PASSWORD=ogkyxfjmhviwvdcs
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=sonhuang4@gmail.com
MAIL_FROM_NAME=Shopping Agent
```

### Logging
```
LOG_CHANNEL=stack
LOG_LEVEL=error
```

## How to Add Environment Variables in Render

1. Go to your Render dashboard
2. Select your service
3. Click on "Environment" tab
4. Click "Add Environment Variable"
5. Add each variable one by one

## Note
- Do NOT commit `.env` files to your repository
- All configuration is done through Render's environment variables
- The `.env` file is only for local development