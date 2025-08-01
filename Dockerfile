# ---- 1. Build frontend ----
  FROM node:18 AS frontend

  WORKDIR /app

  COPY package*.json ./
  RUN npm install

  COPY resources resources
  COPY vite.config.js ./
  COPY tailwind.config.js ./
  COPY public public

  RUN npm run build


  # ---- 2. Build Laravel App ----
  FROM php:8.2-cli

  # Install system dependencies
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

  # Copy Laravel app
  COPY . .

  # ✅ Create required SQLite file for production
  RUN mkdir -p database && \
      touch database/database.sqlite && \
      chown -R www-data:www-data database

  # ✅ Copy frontend build artifacts
  COPY --from=frontend /app/public ./public
  COPY --from=frontend /app/resources ./resources

  # ✅ Install PHP dependencies
  RUN composer install --no-interaction --prefer-dist --optimize-autoloader

  # ✅ Create Laravel cache/log folders and fix permissions
  RUN mkdir -p \
      bootstrap/cache \
      storage/framework/views \
      storage/framework/cache \
      storage/framework/sessions \
      storage/logs && \
      chmod -R 775 storage bootstrap/cache database && \
      chown -R www-data:www-data storage bootstrap/cache database

  # ✅ Run Laravel migrations and receipt migration
  RUN php artisan migrate --force && \
      php artisan receipts:migrate-to-base64

  # ✅ Expose port for Render
  EXPOSE 10000

  # ✅ Start Laravel development server
  CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=10000"]