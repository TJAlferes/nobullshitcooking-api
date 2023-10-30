import request from 'supertest';

import { server } from './index.test.js';

export function recipeTypesTests() {
  describe('GET /v1/recipe-types/:recipe_type_id', () => {
    it('returns data correctly', async () => {
      const res = await request(server).get('/v1/recipe-types/1');
      expect(res.body).toEqual({
        recipe_type_id:   1,
        recipe_type_name: "Drink"
      });
    });
  });
}
