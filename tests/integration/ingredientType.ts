import request from 'supertest';

import { server } from './index.test';

export function ingredientTypeTests() {
  describe('GET /ingredient-type/:id', () => {
    it('returns data correctly', async () => {
      const { body } = await request(server).get('/ingredient-type/1');
      expect(body).toEqual({id: 1, name: "Fish"});
    });
  });
}