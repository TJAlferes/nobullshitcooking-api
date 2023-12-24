import { S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import type { AwsClientStub } from 'aws-sdk-client-mock';
import request from 'supertest';
import type { SuperAgentTest } from 'supertest';
import type { Express } from 'express';

import { AwsS3PrivateUploadsClient } from '../../../src/modules/aws-s3/private-uploads/client';

const S3ClientMock: AwsClientStub<S3Client> = mockClient(AwsS3PrivateUploadsClient);
//AwsS3ClientMock.onAnyCommand().resolves();

// TO DO: add alt_names tests

export function privateIngredientsTests(app: Express) {
  let agent: SuperAgentTest;

  beforeEach(async () => {
    S3ClientMock.reset();

    agent = request.agent(app);

    await agent
      .post('/v1/login')
      .send({
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

  describe('POST /v1/users/:username/private-ingredients', () => {
    it('handles success', async () => {
      const res = await agent
        .post('/v1/users/FakeUser1/private-ingredients')
        .send({
          ingredient_type_id: 4,
          ingredient_brand: 'Brand',
          ingredient_variety: 'Variety',
          ingredient_name: 'Name',
          alt_names: [],
          notes: 'Notes...',
          image_filename: 'default',
          caption: ''
        });

      expect(res.status).toBe(201);
    });
  });

  describe('PATCH /v1/users/:username/private-ingredients', () => {
    it('handles success', async () => {
      const res = await agent
        .patch('/v1/users/FakeUser1/private-ingredients')
        .send({
          ingredient_id: '018b5ade-dc55-7dc0-92dd-3ff30123668b',
          ingredient_type_id: 4,
          ingredient_brand: 'Brand',
          ingredient_variety: 'Variety',
          ingredient_name: 'Name',
          alt_names: [],
          notes: 'Notes...',
          image_id: '018b5ade-dc54-7db1-870g-00733ee1bedf',
          image_filename: 'default',
          caption: ''
        });

      expect(res.status).toBe(204);
    });

    it('handles not found', async () => {
      const res = await agent
        .patch('/v1/users/FakeUser1/private-ingredients')
        .send({
          ingredient_id: '018b5ade-dc55-7dc0-92dd-3ff301230000',
          ingredient_type_id: 4,
          ingredient_brand: 'Brand',
          ingredient_variety: 'Variety',
          ingredient_name: 'Name',
          alt_names: [],
          notes: 'Notes...',
          image_id: '018b5ade-dc54-7db1-870g-00733ee1bedf',
          image_filename: 'default',
          caption: ''
        });

      expect(res.status).toBe(404);
    });

    it('handles forbidden', async () => {
      const res = await agent
        .patch('/v1/users/FakeUser1/private-ingredients')
        .send({
          ingredient_id: '018b5ade-dc56-7dc1-92de-3ff30123668c',
          ingredient_type_id: 4,
          ingredient_brand: 'Brand',
          ingredient_variety: 'Variety',
          ingredient_name: 'Name',
          alt_names: [],
          notes: 'Notes...',
          image_id: '018b5ade-dc55-7db2-870h-00733ee1bedg',
          image_filename: 'default',
          caption: ''
        });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /v1/users/:username/private-ingredients/:ingredient_id', () => {
    it('handles success', async () => {
      const res = await agent
        .delete('/v1/users/FakeUser1/private-ingredients/018b5ade-dc55-7dc0-92dd-3ff30123668b');

      expect(res.status).toBe(204);
    });

    it('handles not found', async () => {
      const res = await agent
        .delete('/v1/users/FakeUser1/private-ingredients/018b5ade-dc55-7dc0-92dd-3ff301230000');

      expect(res.status).toBe(404);
    });

    it('handles forbidden', async () => {
      const res = await agent
        .delete('/v1/users/FakeUser1/private-ingredients/018b5ade-dc56-7dc1-92de-3ff30123668c');

      expect(res.status).toBe(403);
    });
  });
}
