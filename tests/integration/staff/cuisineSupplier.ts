import request from 'supertest';

import { server } from '../index.test';

export function staffCuisineSupplierTests() {
  describe('POST /staff/cuisine-supplier/create', () => {
    it('creates cuisineSupplier', async () => {
      const { body } = await request(server)
        .post('/staff/cuisine-supplier/create')
        .send({cuisine: "French", supplier: "Name"});
      expect(body).toEqual({message: 'Cuisine supplier created.'});
    });
  });

  describe('DELETE /staff/cuisine-supplier/delete', () => {
    it('deletes cuisineSupplier', async () => {
      const { body } = await request(server)
        .delete('/staff/cuisine-supplier/delete')
        .send({cuisine: "French", supplier: "Name"});
      expect(body).toEqual({message: 'Cuisine supplier deleted.'});
    });
  });
}