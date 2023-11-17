import request from 'supertest';
import type { Express } from 'express';

export function unitsTests(app: Express) {
  describe('GET /v1/units/:unit_id', () => {
    it('handles success', async () => {
      const res = await request(app).get('/v1/units/1');
      expect(res.body).toEqual({
        unit_id:   1,
        unit_name: "teaspoon"
      });
    });
  });
}
