import request from 'supertest';

import { server } from './index.test';

export function methodTests() {
  describe('GET /method/:id', () => {
    it('returns data correctly', async () => {
      const { body } = await request(server).get('/method/1');
      expect(body).toEqual({id: 1, name: "No-Cook"});
    });
  });
}