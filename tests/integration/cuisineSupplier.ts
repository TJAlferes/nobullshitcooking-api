import request from 'supertest';

import { server } from './index.test';

export function cuisineSupplierTests() {
  describe('GET /cuisine-supplier/1', () => {
    it('returns data correctly', async () => {
      const { body } = await request(server).get('/cuisine-supplier/1');
      expect(body).toEqual({name: "Blah"});
    });
  });
}