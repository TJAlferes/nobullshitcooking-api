import request from 'supertest';

import { server } from './index.test';

export function cuisineSupplierTests() {
  describe('GET /cuisine-supplier/:cuisine', () => {
    it('returns data correctly', async () => {
      const { body } = await request(server).get('/cuisine-supplier/Afghan');
      expect(body).toEqual({name: "Blah"});
    });
  });
}