import request from 'supertest';
import type { Express } from 'express';

export function profileTests(app: Express) {
  describe('GET /profile/nobody', () => {
    it('returns data correctly', async () => {
      const { body } = await request(app).get('/profile/nobody');
      expect(body).toEqual({message: 'User does not exist.'});
    });
  });

  describe('GET /profile/testman', () => {
    it('returns data correctly', async () => {
      const { body } = await request(app).get('/profile/testman');
      expect(body).toEqual({message: 'Success.', publicRecipes: [], favoriteRecipes: []});
    });
  });
}