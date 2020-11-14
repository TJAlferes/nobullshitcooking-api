import request from 'supertest';

import { server } from './index.test';

export function recipeTypeTests() {
  describe('GET /recipe-type/:name', () => {
    it('returns data correctly', async () => {
      const { body } = await request(server).get('/recipe-type/Drink');
      expect(body).toEqual({name: "Drink"});
    });
  });
}