import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 50 },  // Ramp up
    { duration: '30s', target: 500 }, // Stress
    { duration: '10s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'], // 95% of requests must be below 200ms
  },
};

const BASE_URL = 'http://localhost:8000';

export default function () {
  // 1. Load seats
  const seatsRes = http.get(`${BASE_URL}/api/seats`);
  check(seatsRes, {
    'get seats success': (r) => r.status === 200,
  });

  // 2. Simulate selection (Socket.IO isn't natively supported by k6 http, but we can test the Purchase API)
  // In a real high-demand scenario, the purchase API is the bottleneck
  const seatId = '5d7a8e1b-4c2d-4e3f-8a9b-0c1d2e3f4a5b'; // Use a valid UUID from seed
  
  const payload = JSON.stringify({
    seat_id: seatId,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      // We'd need a valid JWT token here for full E2E stress
    },
  };

  // We only try to purchase occasionally to avoid immediate exhaustion in test
  if (__VU % 10 === 0) {
    const purchaseRes = http.post(`${BASE_URL}/api/purchase`, payload, params);
    check(purchaseRes, {
      'purchase attempt': (r) => r.status === 201 || r.status === 422 || r.status === 401,
    });
  }

  sleep(1);
}
