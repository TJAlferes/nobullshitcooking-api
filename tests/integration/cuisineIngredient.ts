import request from 'supertest';

import { server } from './index.test';

// TO DO: make a formatter for the extra whitespaces

export function cuisineIngredientTests() {
  describe('GET /cuisine-ingredient/:cuisine', () => {
    it('returns data correctly', async () => {
      const { body } = await request(server).get('/cuisine-ingredient/Afghan');
      expect(body).toEqual({id: "NOBSC   Chuck Seven Bone Roast"});
    });
  });
}