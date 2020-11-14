import request from 'supertest';

import { server } from './index.test';

export function measurementTests() {
  describe('GET /measurement/:name', () => {
    it('returns data correctly', async () => {
      const { body } = await request(server).get('/measurement/teaspoon');
      expect(body).toEqual({name: "teaspoon"});
    });
  });
}