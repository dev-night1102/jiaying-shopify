# Shopping Agent Platform

A complete full-stack shopping agent platform similar to PandaBuy, built with Laravel 11, Inertia.js + React 19, Tailwind CSS, and MySQL/PostgreSQL.

## Features

### User Features
- **Authentication**: Registration, login, logout, email verification, and password reset
- **Roles**: User and admin roles with appropriate permissions
- **Membership System**: 30-day trial and monthly paid plan ($9.9/month)
- **User Dashboard**: Membership status, account balance, order history
- **Order Submission**: Paste product links, add notes, upload images
- **Quotation Flow**: Receive quotes from admins, accept/reject quotes
- **Order Tracking**: Real-time status updates from request to delivery
- **Real-Time Chat**: Built-in messaging system with admins
- **Payment System**: Multiple payment methods, account balance, deposit funds
- **Multi-language**: English and Chinese language support

### Admin Features
- **Admin Dashboard**: Overview of users, orders, revenue, and activity
- **Order Management**: View submissions, send quotes, update statuses
- **Logistics Management**: Upload inspection photos, tracking information
- **User Management**: View user details, update balances
- **Chat System**: Real-time communication with users
- **Status Updates**: Manage order progression through all stages

### Technical Features
- **Responsive Design**: Perfect on desktop, tablet, and mobile
- **Real-time Updates**: Live chat and notifications
- **File Upload**: Image handling for products and inspections
- **Search & Filtering**: Advanced order and user filtering
- **Pagination**: Efficient data loading
- **Security**: CSRF protection, input validation, authorization policies
- **API Ready**: Token-based authentication for mobile apps

## Technology Stack

- **Backend**: Laravel 11 (PHP 8.1+)
- **Frontend**: React 19 + Inertia.js
- **Styling**: Tailwind CSS with custom components
- **Database**: MySQL/PostgreSQL with proper migrations
- **Icons**: Lucide React
- **Authentication**: Laravel Sanctum
- **File Storage**: Laravel Storage with public disk

## Installation

### Prerequisites

- PHP 8.1 or higher
- Composer
- Node.js 18+ and npm
- MySQL or PostgreSQL database

### Setup Steps

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd shopping-agent
   composer install
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Database Setup**
   
   Update your `.env` file with database credentials:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=shopping_agent
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

4. **Run Migrations**
   ```bash
   php artisan migrate
   ```

5. **Storage Setup**
   ```bash
   php artisan storage:link
   ```

6. **Build Assets**
   ```bash
   npm run build
   ```

7. **Start Development Server**
   ```bash
   php artisan serve
   npm run dev  # In another terminal for asset watching
   ```

### Creating an Admin User

Run this command to create an admin user:
```bash
php artisan tinker
```

Then in tinker:
```php
$user = App\Models\User::create([
    'name' => 'Admin',
    'email' => 'admin@example.com',
    'password' => bcrypt('password'),
    'role' => 'admin',
    'email_verified_at' => now(),
]);
```

## Project Structure

### Backend Structure
```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Auth/              # Authentication controllers
│   │   ├── Admin/             # Admin-specific controllers
│   │   └── User/              # User-specific controllers
│   ├── Middleware/            # Custom middleware
│   └── Requests/              # Form validation requests
├── Models/                    # Eloquent models
├── Services/                  # Business logic services
└── Policies/                  # Authorization policies

database/migrations/           # Database schema
routes/web.php                # Application routes
```

### Frontend Structure
```
resources/js/
├── Components/               # Reusable React components
├── Layouts/                  # Page layouts
├── Pages/                    # Inertia.js pages
│   ├── Admin/               # Admin pages
│   ├── Auth/                # Authentication pages
│   ├── Chat/                # Chat pages
│   ├── Membership/          # Membership pages
│   ├── Orders/              # Order pages
│   └── Payments/            # Payment pages
├── Utils/                   # Utility functions
└── app.jsx                  # Main application entry

resources/lang/              # Translation files
├── en/app.json             # English translations
└── zh/app.json             # Chinese translations
```

## Key Features Implementation

### Order Flow
1. **Submit Order**: User pastes product link and adds notes/images
2. **Admin Quote**: Admin provides cost breakdown (item cost + service fee + shipping)
3. **User Decision**: User accepts or rejects the quote
4. **Payment**: User pays via balance or external payment method
5. **Fulfillment**: Admin purchases, inspects, and ships the item
6. **Delivery**: User receives the product with tracking updates

### Membership System
- **Trial**: 30-day free trial for new users
- **Paid**: $9.9/month subscription with unlimited features
- **Automatic Expiry**: System automatically handles membership expiration

### Chat System
- **Real-time Communication**: Instant messaging between users and admins
- **Order Context**: Chats can be linked to specific orders
- **File Sharing**: Support for image uploads in chat
- **Read Status**: Track message read status

### Multi-language Support
- **Dynamic Language Switching**: Users can switch between English and Chinese
- **Persistent Preference**: Language choice is saved to user account
- **Complete Translation**: All UI elements are translatable

## Database Schema

### Key Tables
- **users**: User accounts with roles and balances
- **memberships**: Subscription management
- **orders**: Order tracking with status progression
- **order_images**: File attachments for orders
- **logistics**: Shipping and tracking information
- **chats**: Chat conversations
- **messages**: Chat messages with file support
- **payments**: Payment transaction history

## Security Features

- **CSRF Protection**: All forms protected with CSRF tokens
- **Input Validation**: Comprehensive server-side validation
- **Authorization Policies**: Role-based access control
- **Password Hashing**: Secure password storage
- **Email Verification**: Required for account activation
- **Rate Limiting**: Protection against brute force attacks

## Production Deployment

### Requirements
- PHP 8.1+ with required extensions
- Web server (Nginx/Apache)
- MySQL/PostgreSQL database
- Redis (optional, for caching)
- SSL certificate

### Environment Setup
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_DATABASE=shopping_agent
DB_USERNAME=your-username
DB_PASSWORD=your-secure-password

MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-email
MAIL_PASSWORD=your-email-password
```

### Deployment Commands
```bash
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
npm run build
php artisan storage:link
php artisan migrate --force
```

## License

This project is licensed under the MIT License.
