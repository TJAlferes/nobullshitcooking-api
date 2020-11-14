import request from 'supertest';

import { server } from '../index.test';

export function staffCuisineEquipmentTests() {
  describe('POST /staff/cuisine-equipment/create', () => {
    it('creates cuisineEquipment', async () => {
      const { body } = await request(server)
        .post('/staff/cuisine-equipment/create')
        .send({cuisine: "French", equipment: "NOBSC Ceramic Stone"});
      expect(body).toEqual({message: 'Cuisine equipment created.'});
    });
  });

  describe('DELETE /staff/cuisine-equipment/delete', () => {
    it('deletes cuisineEquipment', async () => {
      const { body } = await request(server)
        .delete('/staff/cuisine-equipment/delete')
        .send({cuisine: "French", equipment: "NOBSC Ceramic Stone"});
      expect(body).toEqual({message: 'Cuisine equipment deleted.'});
    });
  });
}