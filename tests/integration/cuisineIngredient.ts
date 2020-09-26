import request from 'supertest';

import { server } from './index.test';

export function cuisineIngredientTests() {
  describe('GET /cuisine-ingredient/1', () => {
    it('returns data correctly', async () => {
      const { body } = await request(server).get('/cuisine-ingredient/1');
      expect(body).toEqual({id: 10, name: "Chuck Seven Bone Roast"});
    });
  });
}