import request from 'supertest';

import { server } from './index.test';

export function contentTypeTests() {
  describe('GET /content-type/:name', () => {
    it('returns data correctly', async () => {
      const { body } = await request(server).get('/content-type/Page');
      expect(body).toEqual({name: "Page", parent: null, path: "/page"});
    });
  });
}