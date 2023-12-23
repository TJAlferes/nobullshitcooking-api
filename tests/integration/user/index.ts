import request from 'supertest';
import type { SuperAgentTest } from 'supertest';
import type { Express } from 'express';

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

export function usersTests(app: Express) {
  describe('POST /v1/users', () => {
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
    
    it('handles success', async () => {
      const res = await request(app)
        .post('/v1/users')  // open handle
        .send({
          email: 'fakeuser@gmail.com',
          password: 'fakepassword',
          username: 'FakeUser'
        });

      expect(res.status).toBe(201);
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

    it('handles new_email already in use', async () => {
      const res = await agent
        .patch('/v1/users/FakeUser1/email')
        .send({new_email: 'fakeuser2@gmail.com'});

      expect(res.status).toBe(409);
      expect(res.body.message).toBe('Email already in use.');
    });

    it('handles success', async () => {
      const res = await agent
        .patch('/v1/users/FakeUser1/email')
        .send({new_email: 'newemail@gmail.com'});

      expect(res.status).toBe(204);
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
        .send({new_password: 'newpassword'});

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

    it('handles new_username already in use', async () => {
      const res = await agent
        .patch('/v1/users/FakeUser1/username')
        .send({new_username: 'FakeUser2'});

      expect(res.status).toBe(409);
      expect(res.body.message).toBe('Username already in use.');
    });

    it('handles success', async () => {
      const res = await agent
        .patch('/v1/users/FakeUser1/username')
        .send({new_username: 'NewUsername'});

      expect(res.status).toBe(204);
    });
  });

  describe('DELETE /v1/users/:username', () => {
    it('handles success', async () => {
      const agent = request.agent(app);

      await agent
        .post('/v1/login')
        .send({
          email: 'fakeuser1@gmail.com',
          password: 'fakepassword'
        });

      const res = await agent.delete('/v1/users/FakeUser1');

      expect(res.status).toBe(204);
    });
  });
}
