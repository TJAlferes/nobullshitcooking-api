import request from 'supertest';

import { server } from './index.test';

export function cuisineEquipmentTests() {
  describe('GET /cuisine-equipment/1', () => {
    it('returns data correctly', async () => {
      const { body } = await request(server).get('/cuisine-equipment/1');
      expect(body).toEqual({id: 3, name: "Cutting Board"});
    });
  });
}