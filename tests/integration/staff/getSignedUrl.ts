import request from 'supertest';

import { server } from '../index.test';

export function staffGetSignedUrlTests() {
  describe ('POST /staff/get-signed-url/content', () => {
    it ('gets signature(s)', async () => {
      const { body } = await request(server)
        .post('/staff/get-signed-url/content')
        .send({fileType: 'png'});
      expect(body.success).toEqual(true);
    });
  });
}