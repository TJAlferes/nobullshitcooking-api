import request from 'supertest';

import { server } from './index.test';

export function methodTests() {
  describe('GET /method/:name', () => {
    it('returns data correctly', async () => {
      const { body } = await request(server).get('/method/No-Cook');
      expect(body).toEqual({name: "No-Cook"});
    });
  });
}