import request from 'supertest';

import { server } from './index.test.js';

export function equipmentTypeTests() {
  describe('GET /v1/equipment-types/:equipment_type_id', () => {
    it('returns data correctly', async () => {
      const res = await request(server).get('/v1/equipment-types/1');
      expect(res.body).toEqual({
        equipment_type_id:   1,
        equipment_type_name: "Cleaning"
      });
    });
  });
}
