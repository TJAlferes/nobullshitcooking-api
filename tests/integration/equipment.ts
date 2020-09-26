import request from 'supertest';

import { server } from './index.test';

export function equipmentTests() {
  describe('GET /equipment/1', () => {
    it('returns data correctly', async () => {
      const { body } = await request(server).get('/equipment/1');
      expect(body).toEqual({
        id: 1,
        owner_id: 1,
        equipment_type_id: 2,
        equipment_type_name: "Preparing",
        name: "Cutting Board",
        description: "It works.",
        image: "nobsc-ceramic-stone"
      });
    });
  });
}