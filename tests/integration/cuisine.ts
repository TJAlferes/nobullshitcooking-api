import request from 'supertest';

import { server } from './index.test.js';

export function cuisineTests() {
  describe('GET /v1/cuisines/:cuisine_id', () => {
    it('returns data correctly', async () => {
      const res = await request(server).get('/v1/cuisines/1');
      expect(res.body).toEqual({
        cuisine_id:     1,
        cuisine_name:   "Algerian",
        continent_code: "AF",
        country_code:   "DZA",
        country_name:   "Algeria"
      });
    });
  });
}
