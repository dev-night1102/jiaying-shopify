# ---- 1. Build frontend (Vite + Tailwind) ----
FROM node:18 AS frontend

WORKDIR /app

# Install Node dependencies
COPY package*.json ./
RUN npm install



# Copy frontend source and config files
COPY resources resources
COPY vite.config.js ./
COPY tailwind.config.cjs ./
COPY postcss.config.cjs ./    
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

# Copy built frontend assets from first stage
COPY --from=frontend /app/public/build ./public/build

# Install PHP dependencies
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

# Create SQLite database file and directories
RUN mkdir -p database && \
    touch database/database.sqlite && \
    mkdir -p \
    bootstrap/cache \
    storage/framework/views \
    storage/framework/cache \
    storage/framework/sessions \
    storage/logs

# Fix permissions
RUN chmod -R 775 storage bootstrap/cache database && \
    chown -R www-data:www-data storage bootstrap/cache database

# Copy startup script
COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Expose port for Render
EXPOSE 10000

# Use startup script
CMD ["/usr/local/bin/start.sh"]