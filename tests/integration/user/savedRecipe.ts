import request from 'supertest';

import { server } from '../index.test';

export function userSavedRecipeTests() {
  describe('POST /user/saved-recipe/create', () => {
    it('creates plan', async () => {
      const { body } = await request(server).post('/user/saved-recipe/create')
        .send({id: 1});
      expect(body).toEqual({message: 'Saved.'});
    });
  });

  describe('DELETE /user/saved-recipe/delete', () => {
    it('deletes plan', async () => {
      const { body } = await request(server).delete('/user/saved-recipe/delete')
        .send({id: 1});
      expect(body).toEqual({message: 'Unsaved.'});
    });
  });
}