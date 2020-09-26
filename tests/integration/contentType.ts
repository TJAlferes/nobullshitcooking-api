import request from 'supertest';

import { server } from './index.test';

export function contentTypeTests() {
  describe('GET /content-type/:contentTypeId', () => {
    it('returns data correctly', async () => {
      const { body } = await request(server).get('/content-type/1');
      expect(body).toEqual({id: 1, parent_id: 0, name: "Page", path: "/page"});
    });
  });
}