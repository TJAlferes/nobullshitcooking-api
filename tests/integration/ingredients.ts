import request from 'supertest';
import type { Express } from 'express';

export function ingredientsTests(app: Express) {
  describe('GET /v1/ingredients/:ingredient_id', () => {
    it('handles success', async () => {
      const res = await request(app).get('/v1/ingredients/Sage');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        ingredient_id: '018b5ade-dc58-70c4-bf36-2edcf351ef12',
        ingredient_type_id: 16,
        ingredient_type_name: 'Herb',
        owner_id: '11111111-1111-1111-1111-111111111111',
        ingredient_brand: '',
        ingredient_variety: '',
        ingredient_name: 'Sage',
        alt_names: null,
        fullname: 'Sage',
        notes: '',
        image_id: '018b5ade-dc58-70c4-bf36-2edba2480d3a',
        image_filename: 'sage',
        caption: ' Sage'
      });
    });

    it('handles not found', async () => {
      const res = await request(app).get('/v1/ingredients/Non%20Existing');
      expect(res.status).toBe(404);
    });
  });
}
