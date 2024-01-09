import request from 'supertest';
import type { Express } from 'express';

export function profileTests(app: Express) {
  describe('GET /v1/users/:username', () => {
    it('handles success', async () => {
      const res = await request(app).get('/v1/users/FakeUser1');
      expect(res.status).toBe(200);
      expect(res.body.user_id).toBe('33333333-3333-3333-3333-333333333333');
    });

    it('handles not found', async () => {
      const res = await request(app).get('/v1/users/NonExistingUser');
      expect(res.status).toBe(404);
    });
  });
}
