import { S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import type { AwsClientStub } from 'aws-sdk-client-mock';
import type { Express } from 'express';

import { AwsS3PrivateUploadsClient } from '../../../src/modules/aws-s3/private-uploads/client';
import { TestAgent } from '../utils/TestAgent';

const S3ClientMock: AwsClientStub<S3Client> = mockClient(AwsS3PrivateUploadsClient);
//AwsS3ClientMock.onAnyCommand().resolves();

export function privateEquipmentTests(app: Express) {
  let agent: TestAgent;

  beforeAll(async () => {
    agent = new TestAgent(app);
    await agent.setCsrfToken();
  });

  beforeEach(async () => {
    S3ClientMock.reset();

    await agent.post('/v1/login', {
      email: 'fakeuser1@gmail.com',
      password: 'fakepassword'
    });
  });

  afterEach(async () => {
    await agent.post('/v1/logout');
  });

  afterAll(() => {
    S3ClientMock.restore();
  });

  /*describe('', () => {
    it('handles success', async () => {
      const res = await agent.get('/v1/users/FakeUser1/private-equipment');
    });
  });*/

  describe('POST /v1/users/:username/private-equipment', () => {
    it('handles success', async () => {
      const res = await agent
        .post('/v1/users/FakeUser1/private-equipment', {
          equipment_type_id: 4,
          equipment_name: 'Name',
          notes: 'Notes...',
          image_filename: 'default',
          caption: ''
        });
      expect(res.status).toBe(201);
    });
  });

  describe('PATCH /v1/users/:username/private-equipment', () => {
    it('handles success', async () => {
      const res = await agent
        .patch('/v1/users/FakeUser1/private-equipment', {
          equipment_id: '018b5ade-5439-7d0d-b42c-f262d9f0b6fc',
          equipment_type_id: 3,
          equipment_name: "Mom's Ladle",
          notes: 'Good soups...',
          image_id: '018b5ade-5437-7ea1-a351-299b6a84f784',
          image_filename: 'default',
          caption: ''
        });
      expect(res.status).toBe(204);
    });

    it('handles not found', async () => {
      const res = await agent
        .patch('/v1/users/FakeUser1/private-equipment', {
          equipment_id: '018b5ade-5439-7d0d-b42c-f262d9f00000',
          equipment_type_id: 3,
          equipment_name: 'Nonexisting Ladle',
          notes: 'Good soups...',
          image_id: '018b5ade-5437-7ea1-a351-299b6a84f784',
          image_filename: 'default',
          caption: ''
        });
      expect(res.status).toBe(404);
    });

    it('handles forbidden', async () => {
      const res = await agent
        .patch('/v1/users/FakeUser1/private-equipment', {
          equipment_id: '018b5ade-5440-7d0e-b42d-f262d9f0b6fd',
          equipment_type_id: 3,
          equipment_name: 'Stolen Spatula',
          notes: 'Good times...',
          image_id: '018b5ade-5438-7ea2-a352-299b6a84f785',
          image_filename: 'default',
          caption: ''
        });
      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /v1/users/:username/private-equipment/:equipment_id', () => {
    it('handles success', async () => {
      const res = await agent
        .delete('/v1/users/FakeUser1/private-equipment/018b5ade-5439-7d0d-b42c-f262d9f0b6fc');
      expect(res.status).toBe(204); 
    });

    it('handles not found', async () => {
      const res = await agent
        .delete('/v1/users/FakeUser1/private-equipment/018b5ade-5439-7d0d-b42c-f262d9f00000');
      expect(res.status).toBe(404); 
    });

    it('handles forbidden', async () => {
      const res = await agent
        .delete('/v1/users/FakeUser1/private-equipment/018b5ade-5440-7d0e-b42d-f262d9f0b6fd');
      expect(res.status).toBe(403);
    });
  });
}
