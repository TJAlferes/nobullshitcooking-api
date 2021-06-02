import request from 'supertest';

import { server } from './index.test';

export function profileTests() {
  describe('GET /profile/nobody', () => {
    it('returns data correctly', async () => {
      const { body } = await request(server).get('/profile/nobody');
      expect(body).toEqual({message: 'User does not exist.'});
    });
  });

  describe('GET /profile/testman', () => {
    it('returns data correctly', async () => {
      const { body } = await request(server).get('/profile/testman');
      expect(body).toEqual({
        message: 'Success.',
        publicRecipes: [],
        favoriteRecipes: []
      });
    });
  });
}