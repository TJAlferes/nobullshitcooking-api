import request from 'supertest';

import { server } from '../index.test';

export function staffEquipmentTests() {
  describe('POST /staff/equipment/create', () => {
    it('creates equipment', async () => {
      const { body } = await request(server).post('/staff/equipment/create')
        .send({
          equipmentTypeId: 4,
          name: "Name",
          description: "Description.",
          image: "image"
        });
      expect(body).toEqual({message: 'Equipment created.'});
    });
  });

  describe('PUT /staff/equipment/update', () => {
    it('updates equipment', async () => {
      const { body } = await request(server).put('/staff/equipment/update')
        .send({
          id: 88,
          equipmentTypeId: 4,
          name: "Name",
          description: "Description.",
          image: "image"
        });
      expect(body).toEqual({message: 'Equipment updated.'});
    });
  });

  describe('DELETE /staff/equipment/delete', () => {
    it('deletes equipment', async () => {
      const { body } = await request(server).delete('/staff/equipment/delete')
        .send({id: 88});
      expect(body).toEqual({message: 'Equipment deleted.'});
    });
  });
}