import request from 'supertest';

import { server } from '../index.test.js';

export function userEquipmentTests() {
  describe('POST /user/equipment/create', () => {
    it('creates equipment', async () => {
      const { body } = await request(server).post('/user/equipment/create').send({ equipmentTypeId: 4, name: "Name", description: "Description.", image: "image"});
      expect(body).toEqual({message: 'Equipment created.'});
    });
  });

  describe('PUT /user/equipment/update', () => {
    it('updates equipment', async () => {
      const { body } = await request(server).put('/user/equipment/update').send({id: 88, equipmentTypeId: 4, name: "Name", description: "Description.", image: "image"});
      expect(body).toEqual({message: 'Equipment updated.'});
    });
  });

  describe('DELETE /user/equipment/delete', () => {
    it('deletes equipment', async () => {
      const { body } = await request(server).delete('/user/equipment/delete').send({id: 88});
      expect(body).toEqual({message: 'Equipment deleted.'}); 
    });
  });
}