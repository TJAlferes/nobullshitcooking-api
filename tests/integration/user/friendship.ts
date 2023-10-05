import request from 'supertest';

import { server } from '../index.test';

export function friendshipTests() {
  it('handles ');
}

describe('Friendship routes', () => {
  it('should return a list of friendships when calling GET /', async () => {
    const response = await request(app).get('/friendships/');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    // You can check for specific properties or values in the response.body
  });
  
  // Add more test cases for other routes (POST, PUT, DELETE, etc.)
});
