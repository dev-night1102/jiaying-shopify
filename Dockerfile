# ---- 1. Build frontend (Vite + Tailwind) ----
FROM node:18 AS frontend

WORKDIR /app

# Install Node dependencies
COPY package*.json ./
RUN npm install

# Copy frontend source and config files
COPY resources resources
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./    
COPY public public

# Build frontend for production
RUN npm run build


# ---- 2. Build Laravel App ----
FROM php:8.2-cli

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libsqlite3-dev \
    pkg-config \
    zip \
    unzip \
    curl \
    git \
 && docker-php-ext-configure pdo_sqlite \
 && docker-php-ext-install pdo pdo_mysql pdo_sqlite mbstring exif pcntl bcmath gd \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy Laravel application
COPY . .

# Create SQLite database file
RUN mkdir -p database && \
    touch database/database.sqlite && \
    chown -R www-data:www-data database

# Copy ONLY built frontend public assets (do not overwrite resources)
COPY --from=frontend /app/public ./public

# Install PHP dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Create Laravel cache/log folders and fix permissions
RUN mkdir -p \
    bootstrap/cache \
    storage/framework/views \
    storage/framework/cache \
    storage/framework/sessions \
    storage/logs && \
    chmod -R 775 storage bootstrap/cache database && \
    chown -R www-data:www-data storage bootstrap/cache database

# Expose port for Render
EXPOSE 10000

# Run migrations at startup and start Laravel server
CMD php artisan migrate --force && \
    php artisan serve --host=0.0.0.0 --port=10000
