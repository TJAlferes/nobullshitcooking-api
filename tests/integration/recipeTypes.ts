import request from 'supertest';
import type { Express } from 'express';

export function recipeTypesTests(app: Express) {
  describe('GET /v1/recipe-types/:recipe_type_id', () => {
    it('handles success', async () => {
      const res = await request(app).get('/v1/recipe-types/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        recipe_type_id: 1,
        recipe_type_name: "Drink"
      });
    });

    it('handles not found', async () => {
      const res = await request(app).get('/v1/recipe-types/999');
      expect(res.status).toBe(404);
    });
  });
}
