import request from 'supertest';
import type { Express } from 'express';

export function equipmentTypesTests(app: Express) {
  describe('GET /v1/equipment-types/:equipment_type_id', () => {
    it('returns data correctly', async () => {
      const res = await request(app).get('/v1/equipment-types/1');
      expect(res.body).toEqual({
        equipment_type_id:   1,
        equipment_type_name: "Cleaning"
      });
    });
  });
}
