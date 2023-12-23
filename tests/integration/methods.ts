import request from 'supertest';
import type { Express } from 'express';

export function methodsTests(app: Express) {
  describe('GET /v1/methods/:method_id', () => {
    it('handles success', async () => {
      const res = await request(app).get('/v1/methods/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        method_id: 1,
        method_name: "No-Cook"
      });
    });

    it('handles not found', async () => {
      const res = await request(app).get('/v1/methods/999');
      expect(res.status).toBe(404);
    });
  });
}
