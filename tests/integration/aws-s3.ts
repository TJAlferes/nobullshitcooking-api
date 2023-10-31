/*
TO DO: finish

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { mockClient } from 'aws-sdk-client-mock';
import request from 'supertest';

import { server } from './index.test.js';

export function AwsS3Tests() {
  describe('POST /v1/signed-url', () => {
    const mock = mockClient(S3Client);

    it('handles success', async () => {
      const agent = request.agent(server);

      await agent
        .post('/v1/login')
        .send({
          email: 'fakeuser1@gmail.com',
          password: 'fakepassword'
        });
      
      const res = await agent
        .post('/v1/signed-url')
        .send({subfolder: 'public/avatar/'});

      expect(res.status).toBe(201);
      expect(res.body).toContain('filename');
      expect(res.body).toContain('smallSignature');
      expect(res.body).toContain('tinySignature');
    })
  });
}
*/
