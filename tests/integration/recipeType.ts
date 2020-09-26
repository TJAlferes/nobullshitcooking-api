import request from 'supertest';

import { server } from './index.test';

export function recipeTypeTests() {
  describe('GET /recipe-type/1', () => {
    it('returns data correctly', async () => {
      const { body } = await request(server).get('/recipe-type/1');
      expect(body).toEqual({id: 1, name: "Drink"});
    });
  });
}