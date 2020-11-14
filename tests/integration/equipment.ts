import request from 'supertest';

import { server } from './index.test';

export function equipmentTests() {
  describe('GET /equipment/:id', () => {
    it('returns data correctly', async () => {
      const { body } = await request(server)
        .get('/equipment/NOBSC%20Cutting%20Board');
      expect(body).toEqual({
        id: "NOBSC Cutting Board",
        owner: "NOBSC",
        type: "Preparing",
        name: "Cutting Board",
        description: "It works.",
        image: "nobsc-cutting-board"
      });
    });
  });
}