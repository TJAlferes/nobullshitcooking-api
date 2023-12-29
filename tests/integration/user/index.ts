import { S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import type { AwsClientStub } from 'aws-sdk-client-mock';
import request from 'supertest';
import type { SuperAgentTest } from 'supertest';
import type { Express } from 'express';

import { AwsS3PublicUploadsClient } from '../../../src/modules/aws-s3/public-uploads/client';

export { authenticationTests } from './authentication';
//export { AwsS3Tests } from './aws-s3';
export { favoriteRecipesTests } from './favorite-recipes';
export { friendshipsTests } from './friendships';
export { privateEquipmentTests } from './private-equipment';
export { privateIngredientsTests } from './private-ingredients';
export { privatePlansTests } from './private-plans';
export { privateRecipesTests } from './private-recipes';
export { profileTests } from './profile';
export { publicPlansTests } from './public-plans';
export { publicRecipesTests } from './public-recipes';
export { savedRecipesTests } from './saved-recipes';

const S3ClientMock: AwsClientStub<S3Client> = mockClient(AwsS3PublicUploadsClient);
//AwsS3ClientMock.onAnyCommand().resolves();

// TO DO: avatar tests

export function usersTests(app: Express) {
  describe('POST /v1/users', () => {
    it('handles success', async () => {
      const res = await request(app)
        .post('/v1/users')
        .send({
          email: 'fakeuser@gmail.com',
          password: 'fakepassword',
          username: 'FakeUser'
        });

      expect(res.status).toBe(201);
    });

    it('handles email already in use', async () => {
      const res = await request(app)
        .post('/v1/users')
        .send({
          email: 'fakeuser1@gmail.com',
          password: 'fakepassword',
          username: 'FakeUser1'
        });

      expect(res.status).toBe(409);
      expect(res.body.message).toBe('Email already in use.');
    });

    it('handles username already in use', async () => {
      const res = await request(app)
        .post('/v1/users')
        .send({
          email: 'fakeuser@gmail.com',
          password: 'fakepassword',
          username: 'FakeUser1'
        });

      expect(res.status).toBe(409);
      expect(res.body.message).toBe('Username already in use.');
    });
  });

  describe('PATCH /v1/users/:username/email', () => {
    let agent: SuperAgentTest;

    beforeEach(async () => {
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

    it('handles success', async () => {
      const res = await agent
        .patch('/v1/users/FakeUser1/email')
        .send({
          new_email: 'newemail@gmail.com',
          password: 'fakepassword'
        });

      expect(res.status).toBe(204);
    });

    it('handles new_email already in use', async () => {
      const res = await agent
        .patch('/v1/users/FakeUser1/email')
        .send({
          new_email: 'fakeuser2@gmail.com',
          password: 'fakepassword'
        });

      expect(res.status).toBe(409);
      expect(res.body.message).toBe('Email already in use.');
    });
  });

  describe('PATCH /v1/users/:username/password', () => {
    let agent: SuperAgentTest;

    beforeEach(async () => {
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

    it('handles success', async () => {
      const res = await agent
        .patch('/v1/users/FakeUser1/password')
        .send({
          new_password: 'newpassword',
          current_password: 'fakepassword'
        });

      expect(res.status).toBe(204);
    });
  });

  describe('PATCH /v1/users/:username/username', () => {
    let agent: SuperAgentTest;

    beforeEach(async () => {
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

    it('handles success', async () => {
      const res = await agent
        .patch('/v1/users/FakeUser1/username')
        .send({new_username: 'NewUsername'});

      expect(res.status).toBe(204);
    });

    it('handles new_username already in use', async () => {
      const res = await agent
        .patch('/v1/users/FakeUser1/username')
        .send({new_username: 'FakeUser2'});

      expect(res.status).toBe(409);
      expect(res.body.message).toBe('Username already in use.');
    });
  });

  describe('POST /v1/users/:username/delete', () => {
    it('handles success', async () => {
      const agent = request.agent(app);

      await agent
        .post('/v1/login')
        .send({
          email: 'fakeuser1@gmail.com',
          password: 'fakepassword'
        });

      const res = await agent
        .post('/v1/users/FakeUser1/delete')
        .send({password: 'fakepassword'});

      expect(res.status).toBe(204);
    });
  });
}
