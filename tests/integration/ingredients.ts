import request from 'supertest';

import { server } from './index.test';

export function ingredientsTests() {
  describe('GET /v1/ingredients/:ingredient_id', () => {
    it('returns data correctly', async () => {
      const res = await request(server)
        .get('/v1/ingredients/018b5ade-dc58-70c4-bf36-2edcf351ef12');
      expect(res.body).toEqual({
        "ingredient_id":        "018b5ade-dc58-70c4-bf36-2edcf351ef12",
        "ingredient_type_id":   16,
        "ingredient_type_name": "Herb",
        "owner_id":             "11111111-1111-1111-1111-111111111111",
        "ingredient_brand":     "",
        "ingredient_variety":   "",
        "ingredient_name":      "Sage",
        "fullname":             "Sage",
        "notes":                "",
        "image_filename":       "sage"
      });
    });
  });
}
