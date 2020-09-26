import request from 'supertest';

import { server } from './index.test';

export function ingredientTests() {
  describe('GET /ingredient/1', () => {
    it('returns data correctly', async () => {
      const { body } = await request(server).get('/ingredient/1');
      expect(body).toEqual({
        id: 1,
        ingredient_type_name: "Fish",
        brand: null,
        variety: null,
        name: "Tuna",
        description: "Tasty.",
        image: "nobsc-tuna"
      });
    });
  });
}