import request from 'supertest';

import { server } from './index.test';

export function ingredientTypeTests() {
  describe('GET /ingredient-type/:name', () => {
    it('returns data correctly', async () => {
      const { body } = await request(server).get('/ingredient-type/Fish');
      expect(body).toEqual({name: "Fish"});
    });
  });
}