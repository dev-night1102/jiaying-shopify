#!/bin/bash

# Create database directory if it doesn't exist
mkdir -p /var/www/database

# Create SQLite database file if it doesn't exist
if [ ! -f /var/www/database/database.sqlite ]; then
    touch /var/www/database/database.sqlite
    chmod 664 /var/www/database/database.sqlite
    chown www-data:www-data /var/www/database/database.sqlite
fi

# Ensure proper permissions
chmod -R 775 /var/www/storage /var/www/bootstrap/cache /var/www/database
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache /var/www/database

# Clear any cached config that might interfere
php artisan config:clear

# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache

# Run database migrations
php artisan migrate --force

# Seed the database
php artisan db:seed --force

# Start Laravel server
php artisan serve --host=0.0.0.0 --port=10000