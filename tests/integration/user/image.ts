import { S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import type { AwsClientStub } from 'aws-sdk-client-mock';
import type { Express } from 'express';

import { AwsS3PublicUploadsClient } from '../../../src/modules/aws-s3/public-uploads/client';
import { TestAgent } from '../utils/TestAgent';

const S3ClientMock: AwsClientStub<S3Client> = mockClient(AwsS3PublicUploadsClient);
//AwsS3ClientMock.onAnyCommand().resolves();

export function avatarImageTests(app: Express) {
  let agent: TestAgent;

  beforeAll(async () => {
    agent = new TestAgent(app);
    await agent.setCsrfToken();
  });

  beforeEach(() => {
    S3ClientMock.reset();
  });

  afterAll(() => {
    S3ClientMock.restore();
  });

  describe('GET /v1/users/:username/avatars/current', () => {
    it('handles success', async () => {
      const res = await agent.get('/v1/users/FakeUser1/avatars/current');
      expect(res.status).toBe(200);
    });
  });

  describe('GET /v1/users/:username/avatars', () => {
    beforeEach(async () => {
      await agent.post('/v1/login', {
        email: 'fakeuser1@gmail.com',
        password: 'fakepassword'
      })
    });

    afterEach(async () => {
      await agent.post('/v1/logout');
    });

    it('handles success', async () => {
      const res = await agent.get('/v1/users/FakeUser1/avatars');
      expect(res.status).toBe(200);
    });

    it('handles forbidden', async () => {
      const res = await agent.get('/v1/users/FakeUser2/avatars');
      expect(res.status).toBe(403);
    });

    it('handles not found', async () => {
      const res = await agent.get('/v1/users/NonExistingUser/avatars');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /v1/users/:username/avatars', () => {
    beforeEach(async () => {
      await agent.post('/v1/login', {
        email: 'fakeuser1@gmail.com',
        password: 'fakepassword'
      })
    });

    afterEach(async () => {
      await agent.post('/v1/logout');
    });

    it('handles success', async () => {
      const res = await agent.post('/v1/users/FakeUser1/avatars', {new_avatar: 'image_filename'});
      expect(res.status).toBe(204);
    });
  });

  /*describe('PATCH /v1/users/:username/avatars/current/:image_id', () => {
    it('handles success', async () => {
      const res = await agent.patch('/v1/users/FakeUser1/avatars/current');
      expect(res.status).toBe(204);
    });

    // TO DO: finish
  });*/

  describe('DELETE /v1/users/:username/avatars/:image_id', () => {
    beforeEach(async () => {
      await agent.post('/v1/login', {
        email: 'fakeuser1@gmail.com',
        password: 'fakepassword'
      })
    });

    afterEach(async () => {
      await agent.post('/v1/logout');
    });

    it('handles success', async () => {
      const res = await agent
        .delete('/v1/users/FakeUser1/avatars/03030303-0303-0303-0303-030303030303');
      expect(res.status).toBe(204);
    });

    it('handles forbidden -- attempt to delete default image', async () => {
      const res = await agent
        .delete('/v1/users/FakeUser1/avatars/00000000-0000-0000-0000-000000000000');
      expect(res.status).toBe(403);
    });

    it('handles forbidden -- unauthorized user', async () => {
      const res = await agent
        .delete('/v1/users/FakeUser2/avatars/03030303-0303-0303-0303-030303030303');
      expect(res.status).toBe(403);
    });

    it('handles not found', async () => {
      const res = await agent
        .delete('/v1/users/FakeUser1/avatars/05050505-0505-0505-0505-050505050505');
      expect(res.status).toBe(404);
    });
  });
}
