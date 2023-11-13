import request from 'supertest';

import { server } from './index.test';

export function equipmentTests() {
  describe('GET /v1/equipment/:equipment_id', () => {
    it('returns data correctly', async () => {
      const res = await request(server)
        .get('/v1/equipment/"018b5ade-5438-7d0c-b42b-f2641487f7cc"');
      expect(res.body).toEqual({
        "equipment_id":        "018b5ade-5438-7d0c-b42b-f2641487f7cc",
        "equipment_type_id":   2,
        "equipment_type_name": "Preparing",
        "owner_id":            "11111111-1111-1111-1111-111111111111",
        "equipment_name":      "Chef's Knife",
        "notes":               "",
        "image_id":            "chefs-knife"
      });
    });
  });
}
