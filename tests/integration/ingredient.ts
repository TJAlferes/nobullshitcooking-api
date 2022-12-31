import request from 'supertest';

import { server } from './index.test';

// TO DO: fix the extra spaces from null/empty brands/varieties

export function ingredientTests() {
  describe('GET /ingredient/:id', () => {
    it('returns data correctly', async () => {
      const { body } = await request(server).get('/ingredient/1');
      expect(body).toEqual({id: 1, ingredient_type_name: "Fish", brand: null, variety: null, name: "Tuna", description: "Tasty.", image: "tuna"
      });
    });
  });
}