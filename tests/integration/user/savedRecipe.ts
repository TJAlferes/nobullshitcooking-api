import request from 'supertest';

import { server } from '../index.test';

export function userSavedRecipeTests() {
  describe('POST /user/saved-recipe/create', () => {
    it('creates plan', async () => {
      const { body } = await request(server).post('/user/saved-recipe/create')
        .send({id: "Username Title"});
      expect(body).toEqual({message: 'Saved.'});
    });
  });

  describe('DELETE /user/saved-recipe/delete', () => {
    it('deletes plan', async () => {
      const { body } = await request(server).delete('/user/saved-recipe/delete')
        .send({id: "Username Title"});
      expect(body).toEqual({message: 'Unsaved.'});
    });
  });
}