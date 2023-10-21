import request from 'supertest';

import { server } from './index.test';

export function cuisineTests() {
  describe('GET /cuisine/:id', () => {
    it('returns data correctly', async () => {
      const { body } = await request(server).get('/cuisine/1');

      expect(body).toEqual({
        id: 1,
        name: "Afghan",
        nation: "Afghanistan"
      });
    });
  });
}
