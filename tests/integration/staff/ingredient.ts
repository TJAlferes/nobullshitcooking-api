import request from 'supertest';

import { server } from '../index.test';

export function staffIngredientTests() {
  describe('POST /staff/ingredient/create', () => {
    it('creates ingredient', async () => {
      const { body } = await request(server).post('/staff/ingredient/create')
        .send({
          type: "Beef",
          brand: "Brand",
          variety: "Variety",
          name: "Name",
          description: "Description.",
          image: "image"
        });
      expect(body).toEqual({message: 'Ingredient created.'});
    });
  });

  describe('PUT /staff/ingredient/update', () => {
    it('updates ingredient', async () => {
      const { body } = await request(server).put('/staff/ingredient/update')
        .send({
          id: "NOBSC Brand Variety Name",
          type: "Beef",
          brand: "Brand",
          variety: "Variety",
          name: "Name",
          description: "Description.",
          image: "image"
        });
      expect(body).toEqual({message: 'Ingredient updated.'});
    });
  });

  describe('DELETE /staff/ingredient/delete', () => {
    it('deletes ingredient', async () => {
      const { body } = await request(server).delete('/staff/ingredient/delete')
        .send({id: "NOBSC Brand Variety Name"});
      expect(body).toEqual({message: 'Ingredient deleted.'});
    });
  });
}