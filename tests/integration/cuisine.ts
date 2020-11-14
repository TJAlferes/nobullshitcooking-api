import request from 'supertest';

import { server } from './index.test';

export function cuisineTests() {
  describe('GET /cuisine/:name', () => {
    it('returns data correctly', async () => {
      const { body } = await request(server).get('/cuisine/Afghan');
      expect(body).toEqual({name: "Afghan", nation: "Afghanistan"});
    });
  });
}