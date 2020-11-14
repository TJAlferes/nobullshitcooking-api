import request from 'supertest';

import { server } from '../index.test';

export function staffSupplierTests() {
  describe('POST /staff/supplier/create', () => {
    it('creates supplier', async () => {
      const { body } = await request(server).post('/staff/supplier/create')
        .send({name: "Name"});
      expect(body).toEqual({message: 'Supplier created.'});
    });
  });

  describe('PUT /staff/supplier/update', () => {
    it('updates supplier', async () => {
      const { body } = await request(server).put('/staff/supplier/update')
        .send({name: "Name"});
      expect(body).toEqual({message: 'Supplier updated.'});
    });
  });

  describe('DELETE /staff/supplier/delete', () => {
    it('deletes supplier', async () => {
      const { body } = await request(server).delete('/staff/supplier/delete')
        .send({name: "Name"});
      expect(body).toEqual({message: 'Supplier deleted.'});
    });
  });
}