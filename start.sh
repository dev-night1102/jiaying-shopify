#!/bin/bash

echo "Starting application setup..."

# Generate APP_KEY if not set
if [ -z "$APP_KEY" ]; then
    echo "Generating APP_KEY..."
    export APP_KEY=$(php -r "echo 'base64:' . base64_encode(random_bytes(32));")
    echo "Generated APP_KEY: $APP_KEY"
fi

# Set default environment variables if not provided
export APP_NAME="${APP_NAME:-Global Procurement Pro}"
export APP_ENV="${APP_ENV:-production}"
export APP_DEBUG="${APP_DEBUG:-false}"
export APP_URL="${APP_URL:-https://jiaying-shopify.onrender.com}"
export DB_CONNECTION="${DB_CONNECTION:-sqlite}"
export DB_DATABASE="${DB_DATABASE:-/var/www/database/database.sqlite}"
export DB_FOREIGN_KEYS="${DB_FOREIGN_KEYS:-true}"
export MAIL_MAILER="${MAIL_MAILER:-log}"
export LOG_CHANNEL="${LOG_CHANNEL:-stack}"
export LOG_LEVEL="${LOG_LEVEL:-error}"

echo "Environment variables set."

# Create database directory if it doesn't exist
mkdir -p /var/www/database

# Create SQLite database file if it doesn't exist
if [ ! -f /var/www/database/database.sqlite ]; then
    echo "Creating SQLite database..."
    touch /var/www/database/database.sqlite
    chmod 664 /var/www/database/database.sqlite
    chown www-data:www-data /var/www/database/database.sqlite
fi

# Ensure proper permissions
chmod -R 775 /var/www/storage /var/www/bootstrap/cache /var/www/database
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache /var/www/database

echo "Permissions set."

# Clear any cached config that might interfere
php artisan config:clear

# Cache configuration
php artisan config:cache

echo "Configuration cached."

# Cache routes
php artisan route:cache

echo "Routes cached."

# Run database migrations
echo "Running migrations..."
php artisan migrate --force

# Seed the database
echo "Seeding database..."
php artisan db:seed --force

echo "Database setup complete."

# Start Laravel server
echo "Starting Laravel server on port 10000..."
php artisan serve --host=0.0.0.0 --port=10000