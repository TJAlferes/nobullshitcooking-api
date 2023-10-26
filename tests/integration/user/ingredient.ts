import request from 'supertest';

import { server } from '../index.test.js';

export function userIngredientTests() {
  describe('POST /user/ingredient/create', () => {
    it('creates ingredient', async () => {
      const { body } = await request(server).post('/user/ingredient/create')
        .send({ingredientTypeId: 4, brand: "Brand", variety: "Variety", name: "Name", description: "Description.", image: "image"});
      expect(body).toEqual({message: 'Ingredient created.'}); 
    });
  });

  describe('PUT /user/ingredient/update', () => {
    it('updates ingredient', async () => {
      const { body } = await request(server).put('/user/ingredient/update')
        .send({id: 888, ingredientTypeId: 4, brand: "Brand", variety: "Variety", name: "Name", description: "Description.", image: "image"});
      expect(body).toEqual({message: 'Ingredient updated.'}); 
    });
  });

  describe('DELETE /user/ingredient/delete', () => {
    it('deletes ingredient', async () => {
      const { body } = await request(server).delete('/user/ingredient/delete').send({id: 888});
      expect(body).toEqual({message: 'Ingredient deleted.'}); 
    });
  });
}