# Real-time Communication Contract

This document defines the data formats for server-to-client updates via Server-Sent Events (SSE) and bi-directional interaction via WebSockets.

---

## 1. Server-Sent Events (SSE): Broadcasts

Used for massive, unidirectional status updates (50,000+ viewers).

- **Endpoint**: `GET /v1/realtime/broadcast`
- **Mechanism**: The server pushes events as soon as they are processed from the `outbox_events` table.

### Event: `seat.updated`
Sent whenever a seat status changes.

```json
event: seat.updated
data: {
  "id": "uuid-seat-123",
  "status": "LOCKED",
  "u": "uuid-user-456",
  "ts": 1679824000
}
```

- **id**: Seat identifier.
- **status**: New status (`LOCKED`, `SOLD`, `AVAILABLE`).
- **u**: User ID (only for `LOCKED`, otherwise omitted).
- **ts**: Unix timestamp of the update.

---

## 2. WebSockets: Interactive Selection

Used for the low-latency selection and purchase flow (via Laravel Reverb).

- **Endpoint**: `WS /v1/realtime/interactive`
- **Channel**: `private-user.{user_id}`

### Server to Client (S -> C)

#### Event: `lock.confirmed`
Confirms the user's action to lock a seat.

```json
{
  "event": "lock.confirmed",
  "data": {
    "seat_id": "uuid-seat-123",
    "expires_at": "2026-04-04T23:10:00Z"
  }
}
```

#### Event: `lock.expired`
Notifies the user that their 10-minute window has closed.

```json
{
  "event": "lock.expired",
  "data": {
    "seat_id": "uuid-seat-123"
  }
}
```

#### Event: `purchase.success`
Confirms that the transaction was recorded.

```json
{
  "event": "purchase.success",
  "data": {
    "sale_id": "uuid-sale-789",
    "seat_id": "uuid-seat-123",
    "tx": "TXN_ABC123"
  }
}
```

### Client to Server (C -> S)

#### Event: `seat.select`
The user clicks a seat on the map. (Equivalent to `POST /seats/{id}/lock`).

```json
{
  "event": "seat.select",
  "data": {
    "seat_id": "uuid-seat-123"
  }
}
```

---

## 3. Data Integrity & Reconnection

- **SSE Last-Event-ID**: Clients MUST track the last event ID received. Upon reconnection, they MUST send the `Last-Event-ID` header to receive missed updates.
- **Map Full Sync**: If a client is disconnected for more than 30 seconds, they MUST perform a full state fetch via `GET /seats` to ensure the map is accurate.
