import request from 'supertest';

import { server } from './index.test';

// TO DO: fix the extra spaces from null/empty brands/varieties

export function ingredientTests() {
  describe('GET /ingredient/:id', () => {
    it('returns data correctly', async () => {
      const { body } = await request(server).get('/ingredient/NOBSC%20Tuna');
      expect(body).toEqual({
        id: "NOBSC Tuna",
        type: "Fish",
        brand: null,
        variety: null,
        name: "Tuna",
        fullname: "NOBSC Tuna",
        description: "Tasty.",
        image: "nobsc-tuna"
      });
    });
  });
}