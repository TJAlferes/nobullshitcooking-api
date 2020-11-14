import request from 'supertest';

import { server } from '../index.test';

export function staffCuisineIngredientTests() {
  describe('POST /staff/cuisine-ingredient/create', () => {
    it('creates cuisineIngredient', async () => {
      const { body } = await request(server)
        .post('/staff/cuisine-ingredient/create')
        .send({cuisine: "French", ingredient: "NOBSC Shallots"});
      expect(body).toEqual({message: 'Cuisine ingredient created.'});
    });
  });

  describe('DELETE /staff/cuisine-ingredient/delete', () => {
    it('deletes cuisineIngredient', async () => {
      const { body } = await request(server)
        .delete('/staff/cuisine-ingredient/delete')
        .send({cuisine: "French", ingredient: "NOBSC Shallots"});
      expect(body).toEqual({message: 'Cuisine ingredient deleted.'});
    });
  });
}