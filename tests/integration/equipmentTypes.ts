import request from 'supertest';
import type { Express } from 'express';

export function equipmentTypesTests(app: Express) {
  describe('GET /v1/equipment-types/:equipment_type_id', () => {
    it('handles success', async () => {
      const res = await request(app).get('/v1/equipment-types/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        equipment_type_id: 1,
        equipment_type_name: "Cleaning"
      });
    });

    it('handles not found', async () => {
      const res = await request(app).get('/v1/equipment-types/999');
      expect(res.status).toBe(404);
    });
  });
}
