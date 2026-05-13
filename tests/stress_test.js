import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp up to 20 users
    { duration: '1m', target: 20 },  // Stay at 20 users
    { duration: '30s', target: 0 },  // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must be below 500ms
  },
};

export default function () {
  // Test the main landing page
  const res = http.get('http://localhost:5173');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'body contains Mister Churras': (r) => r.body.includes('Mister Churras'),
  });

  sleep(1);
}
