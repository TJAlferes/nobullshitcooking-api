import request from 'supertest';

import { server } from '../index.test';

export function userFavoriteRecipeTests() {
  describe('POST /user/favorite-recipe/create', () => {
    it('creates plan', async () => {
      const { body } = await request(server)
        .post('/user/favorite-recipe/create')
        .send({id: "Username Title"});
      expect(body).toEqual({message: 'Favorited.'});
    });
  });

  describe('DELETE /user/favorite-recipe/delete', () => {
    it('deletes plan', async () => {
      const { body } = await request(server)
        .delete('/user/favorite-recipe/delete')
        .send({id: "Username Title"});
      expect(body).toEqual({message: 'Unfavorited.'}); 
    });
  });
}