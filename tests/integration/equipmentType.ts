import request from 'supertest';

import { server } from './index.test';

export function equipmentTypeTests() {
  describe('GET /equipment-type/:name', () => {
    it('returns data correctly', async () => {
      const { body } = await request(server).get('/equipment-type/Cleaning');
      expect(body).toEqual({name: "Cleaning"});
    });
  });
}