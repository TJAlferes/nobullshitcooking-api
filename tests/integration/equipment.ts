import request from 'supertest';
import type { Express } from 'express';

export function equipmentTests(app: Express) {
  describe('GET /v1/equipment/:equipment_id', () => {
    it('handles success', async () => {
      const res = await request(app)
        .get('/v1/equipment/018b5ade-5438-7d0c-b42b-f2641487f7cc');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        equipment_id: '018b5ade-5438-7d0c-b42b-f2641487f7cc',
        equipment_type_id: 2,
        equipment_type_name: 'Preparing',
        owner_id: '11111111-1111-1111-1111-111111111111',
        equipment_name: "Chef's Knife",
        notes: '',
        image_id: '018b5ade-5438-7d0c-b42b-f263bc891d0a',
        image_filename: 'chefs-knife',
        caption: "Chef's Knife",
      });
    });

    it('handles not found', async () => {
      const res = await request(app)
        .get('/v1/equipment/018b5ade-5438-7d0c-b42b-f26414f00000');
      expect(res.status).toBe(404);
    });
  });
}
