import request from 'supertest';

import { server } from './index.test.js';

export function methodsTests() {
  describe('GET /v1/methods/:method_id', () => {
    it('returns data correctly', async () => {
      const res = await request(server).get('/v1/methods/1');
      expect(res.body).toEqual({
        method_id:   1,
        method_name: "No-Cook"
      });
    });
  });
}
