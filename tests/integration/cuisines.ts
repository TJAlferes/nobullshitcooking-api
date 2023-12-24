import request from 'supertest';
import type { Express } from 'express';

export function cuisinesTests(app: Express) {
  describe('GET /v1/cuisines/:cuisine_id', () => {
    it('handles success', async () => {
      const res = await request(app).get('/v1/cuisines/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        cuisine_id: 1,
        cuisine_name: 'Algerian',
        continent_code: 'AF',
        country_code: 'DZA',
        country_name: 'Algeria'
      });
    });

    it('handles not found', async () => {
      const res = await request(app).get('/v1/cuisines/999');
      expect(res.status).toBe(404);
    });
  });
}
