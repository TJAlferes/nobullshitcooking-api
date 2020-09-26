import request from 'supertest';

import { server } from '../index.test';

export function staffCuisineIngredientTests() {
  describe('POST /staff/cuisine-ingredient/create', () => {
    it('creates cuisineIngredient', async () => {
      const { body } = await request(server)
        .post('/staff/cuisine-ingredient/create')
        .send({cuisineId: 4, ingredientId: 4});
      expect(body).toEqual({message: 'Cuisine ingredient created.'});
    });
  });

  describe('DELETE /staff/cuisine-ingredient/delete', () => {
    it('deletes cuisineIngredient', async () => {
      const { body } = await request(server)
        .delete('/staff/cuisine-ingredient/delete')
        .send({cuisineId: 4, ingredientId: 4});
      expect(body).toEqual({message: 'Cuisine ingredient deleted.'});
    });
  });
}