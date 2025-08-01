# Shopping Agent Platform Setup Guide

## Prerequisites
- PHP 8.1 or higher
- Composer
- Node.js 16+ and npm
- MySQL or SQLite

## Installation Steps

### 1. Clone the repository
```bash
git clone https://github.com/sonhuang4/shopify.git
cd shopify
```

### 2. Install PHP dependencies
```bash
composer install
```

### 3. Install JavaScript dependencies
```bash
npm install
```

### 4. Environment setup
```bash
# Copy the environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 5. Database setup

#### Option A: Using SQLite (Recommended for development)
```bash
# Install SQLite PHP extension (if not installed)
sudo apt install php8.1-sqlite3

# Create SQLite database file
touch database/database.sqlite

# Update .env file
# Set DB_CONNECTION=sqlite
# Set DB_DATABASE=/absolute/path/to/database/database.sqlite
```

#### Option B: Using MySQL
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE shopping_agent;
exit;

# Update .env file with your MySQL credentials
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=shopping_agent
# DB_USERNAME=your_username
# DB_PASSWORD=your_password
```

### 6. Run database migrations
```bash
php artisan migrate
```

### 7. Build frontend assets
```bash
npm run build
```

### 8. Start the development server
```bash
# In terminal 1 - Start Laravel server
php artisan serve --port=8080

# In terminal 2 - Start Vite dev server (for hot reload)
npm run dev
```

The application will be available at: http://localhost:8080

## Quick Start (All commands)
```bash
# Clone and enter directory
git clone https://github.com/sonhuang4/shopify.git && cd shopify

# Install dependencies
composer install && npm install

# Setup environment
cp .env.example .env && php artisan key:generate

# For SQLite (quick setup)
touch database/database.sqlite
sed -i 's/DB_CONNECTION=mysql/DB_CONNECTION=sqlite/' .env
sed -i "s|DB_DATABASE=.*|DB_DATABASE=$PWD/database/database.sqlite|" .env

# Run migrations
php artisan migrate

# Build and run
npm run build
php artisan serve --port=8080
```

## Troubleshooting

### Database Connection Error
If you get "could not find driver" error:
- For SQLite: Install `php8.1-sqlite3`
- For MySQL: Install `php8.1-mysql`

### Missing .env file
Always copy `.env.example` to `.env` before running the application.

### Permission Issues
```bash
chmod -R 755 storage bootstrap/cache
```

## Features
- User authentication and registration
- Multi-language support (English/Chinese)
- Order management system
- Admin dashboard
- Real-time chat system
- Payment processing
- Membership system