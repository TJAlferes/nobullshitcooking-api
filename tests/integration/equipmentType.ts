import request from 'supertest';

import { server } from './index.test';

export function equipmentTypeTests() {
  describe('GET /equipment-type/1', () => {
    it('returns data correctly', async () => {
      const { body } = await request(server).get('/equipment-type/1');
      expect(body).toEqual({id: 1, name: "Cleaning"});
    });
  });
}