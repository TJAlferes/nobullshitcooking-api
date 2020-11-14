import request from 'supertest';

import { server } from './index.test';

export function cuisineEquipmentTests() {
  describe('GET /cuisine-equipment/:cuisine', () => {
    it('returns data correctly', async () => {
      const { body } = await request(server).get('/cuisine-equipment/Afghan');
      expect(body).toEqual({equipment: "NOBSC Cutting Board"});
    });
  });
}