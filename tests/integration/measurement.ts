import request from 'supertest';

import { server } from './index.test';

export function measurementTests() {
  describe('GET /measurement/1', () => {
    it('returns data correctly', async () => {
      const { body } = await request(server).get('/measurement/1');
      expect(body).toEqual({id: 1, name: "teaspoon"});
    });
  });
}