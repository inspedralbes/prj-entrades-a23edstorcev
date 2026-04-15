# Utilitzem 'bookworm' que és la versió estable (molt més fiable que trixie)
FROM php:8.3-fpm-bookworm

# Configuració per millorar la fiabilitat de les descàrregues
RUN echo "Acquire::Retries \"5\";" > /etc/apt/apt.conf.d/80-retries

# Install system dependencies
RUN apt-get update --fix-missing || true && \
    apt-get install -y --no-install-recommends \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader
# Cargar entorno de producción
RUN cp .env.example .env || true

# Create storage link within container
RUN php artisan storage:link || true

# Expose port 8000
EXPOSE 8000

# Start Laravel server with auto-migrate and seed
CMD sh -c "sleep 15 && php artisan migrate --force --seed && php artisan serve --host=0.0.0.0 --port=8000"
