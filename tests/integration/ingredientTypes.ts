import request from 'supertest';
import type { Express } from 'express';

export function ingredientTypesTests(app: Express) {
  describe('GET /v1/ingredient-types/:ingredient_type_id', () => {
    it('returns data correctly', async () => {
      const res = await request(app).get('/v1/ingredient-types/1');
      expect(res.body).toEqual({
        ingredient_type_id:   1,
        ingredient_type_name: "Fish"
      });
    });
  });
}
