# Research: High-Demand Ticketing Platform

This document outlines the research and technical decisions for handling extreme concurrency (5000+ req/s) and real-time synchronization for 50,000+ users in a PHP 8.x environment.

---

## 1. High-Concurrency Locking in PHP/Redis

### Decision
Implement atomic locking using **Redis** with **Lua scripts** for "Check-and-Set" operations. Specifically, use the `SET key value NX PX milliseconds` command for simple locks, and Lua scripts for complex conditional state changes (e.g., transition from `Locked` to `Sold`).

### Rationale
*   **Atomicity**: Redis executes Lua scripts as a single atomic operation. This prevents race conditions where two PHP processes check if a seat is available and both attempt to lock it at the exact same millisecond.
*   **Performance**: Redis operates in-memory with O(1) complexity for key lookups. It can easily handle tens of thousands of operations per second, far exceeding traditional RDBMS locking capabilities.
*   **Native TTL**: The `PX` (milliseconds) argument ensures that locks automatically expire if a user abandons their session, fulfilling the requirement for a 10-minute timeout without requiring a manual cleanup cron job for the ephemeral state.

### Alternatives
*   **Pessimistic DB Locking (`SELECT ... FOR UPDATE`)**: Rejected because it holds database connections open, leading to "connection exhaustion" during a 5000+ req/s stampede.
*   **Optimistic DB Locking (Version Columns)**: Rejected because high contention on the same seats would cause a massive number of transaction rollbacks and retries, degrading performance.

---

## 2. Real-time Synchronization: SSE vs. WebSockets

### Decision
Use **Server-Sent Events (SSE)** for broadcasting seat map updates to 50,000+ concurrent viewers, and **WebSockets** (via Laravel Reverb or Soketi) for the interactive selection and checkout flow.

### Rationale
*   **Scalability (SSE)**: SSE is unidirectional and operates over standard HTTP. It is easier to load-balance and more memory-efficient for massive broadcasts (50k+ users) where users are mostly "consuming" the state of the map.
*   **Interactive Low Latency (WebSockets)**: For the actual selection and reservation flow, the bi-directional nature of WebSockets reduces the overhead of repeated HTTP headers, providing the "millisecond-level" feedback loop required for a responsive UX during the stampede.
*   **Battery/Resource Efficiency**: SSE handles reconnections natively and is less taxing on mobile clients compared to maintaining a full-duplex WebSocket for long periods of passive viewing.

### Alternatives
*   **WebSockets for Everything**: While possible, scaling WebSockets to 50,000 concurrent connections requires significant infrastructure (e.g., high-memory load balancers, specialized pub/sub scaling).
*   **Long Polling**: Rejected due to high server overhead and latency.

---

## 3. Transactional Outbox in PHP/Laravel

### Decision
Implement the **Transactional Outbox Pattern** using a dedicated `outbox_events` table in the SQL database.

### Rationale
*   **Guaranteed Consistency**: When a seat is marked as `Sold` in the database, the "Sold" event is saved in the same database transaction. This ensures that we never broadcast a "Sold" event via SSE/WebSockets if the database transaction fails (and vice-versa).
*   **Reliable Propagation**: A background worker (Laravel Queue) polls the outbox table or uses a database WAL listener to forward events to the Real-time Sync layer. If the WebSocket server is temporarily down, the events remain in the outbox and can be retried.
*   **Architectural Decoupling**: The core business logic doesn't need to know about the real-time infrastructure, only the database.

### Alternatives
*   **Dual Writes**: (Writing to DB then immediately publishing to Redis/WebSockets). Rejected because if the second write fails, the map shows a seat as sold while it isn't in the DB, or vice-versa.

---

## 4. Testing Stack: k6 vs. Artillery

### Decision
Utilize **k6** for high-concurrency stress testing and performance benchmarking.

### Rationale
*   **Performance**: k6 is written in Go and can generate significantly more load (Virtual Users) per machine compared to Node.js-based tools like Artillery.
*   **Scripting**: It uses JavaScript for test definitions, making it accessible to the development team while maintaining the performance of a compiled core.
*   **Protocol Support**: Excellent support for testing both the REST API (locking) and the real-time components (WebSockets/SSE) in a single unified script.
*   **Metrics**: Provides detailed percentile latency (p95, p99) which is critical for verifying the <200ms sync requirement.

### Alternatives
*   **Artillery**: Good for basic scenarios but hits a "performance wall" earlier than k6 when simulating 5,000+ req/s on standard CI runners.
*   **JMeter**: Rejected due to its XML-based configuration and high resource footprint.
