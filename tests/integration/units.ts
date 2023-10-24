import request from 'supertest';

import { server } from './index.test.js';

export function unitsTests() {
  describe('GET /v1/units/:unit_id', () => {
    it('handles success', async () => {
      const res = await request(server).get('/v1/units/1');
      expect(res.body).toEqual({
        unit_id: 1,
        unit_name: "teaspoon"
      });
    });
  });
}
