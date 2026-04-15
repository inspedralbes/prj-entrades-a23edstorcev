# Quickstart Guide: High-Demand Ticketing Platform

Follow these steps to set up the development environment and run the seat-selection "stampede" simulation.

---

## 1. Prerequisites

Ensure you have the following installed:

- **PHP 8.2+** with extension `redis` enabled.
- **Composer** for dependency management.
- **Docker & Docker Compose** for infrastructure.
- **k6** (optional, for load testing).

---

## 2. Infrastructure Setup

Use Docker Compose to launch PostgreSQL and Redis:

```bash
docker-compose up -d
```

Copy the environment configuration:

```bash
cp .env.example .env
```

Set the database and Redis credentials in your `.env` file.

---

## 3. Installation & Seeding

Install PHP dependencies:

```bash
composer install
```

Run database migrations to create the `seats`, `sales`, and `outbox_events` tables:

```bash
php artisan migrate
```

Seed the seat map (creates 1,000 available seats):

```bash
php artisan db:seed --class=SeatMapSeeder
```

---

## 4. Running the Application

Start the local development server:

```bash
php artisan serve
```

Start the real-time broadcast worker (polls the outbox):

```bash
php artisan outbox:process --realtime
```

Launch the WebSocket server (Laravel Reverb):

```bash
php artisan reverb:start
```

---

## 5. Simulating the "Stampede" (Load Testing)

To verify the system can handle 5,000 requests per second, use the provided k6 script:

```bash
k6 run tests/load/stampede.js
```

Observe the real-time synchronization latency and ensure zero double-sales in the dashboard.
