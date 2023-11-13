import request from 'supertest';
import type { SuperAgentTest } from 'supertest';

import { server } from '../index.test';

export { authenticationTests } from './authentication';
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

export function usersTests() {
  describe('POST /v1/users', () => {
    it('handles email already in use', async () => {
      const res = await request(server)
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
      const res = await request(server)
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
      const res = await request(server)
        .post('/v1/users')
        .send({
          email: 'fakeuser@gmail.com',
          password: 'fakepassword',
          username: 'FakeUser'
        });

      expect(res.status).toBe(201);
    });
  });



  describe('PATCH /v1/users/FakeUser1/email', () => {
    let agent: SuperAgentTest;

    beforeEach(async () => {
      agent = request.agent(server);

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

    it('handles non-existing user', async () => {
      const res = await agent
        .patch('/v1/users/NonExistingUser/email')
        .send({new_email: 'newemail@gmail.com'});

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User does not exist.');
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



  describe('PATCH /v1/users/FakeUser1/password', () => {
    let agent: SuperAgentTest;

    beforeEach(async () => {
      agent = request.agent(server);

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

    it('handles non-existing user', async () => {
      const res = await agent
        .patch('/v1/users/NonExistingUser/password')
        .send({new_password: 'newpassword'});

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User does not exist.');
    });

    it('handles success', async () => {
      const res = await agent
        .patch('/v1/users/FakeUser1/password')
        .send({new_password: 'newpassword'});

      expect(res.status).toBe(204);
    });
  });



  describe('PATCH /v1/users/FakeUser1/username', () => {
    let agent: SuperAgentTest;

    beforeEach(async () => {
      agent = request.agent(server);

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

    it('handles non-existing user', async () => {
      const res = await agent
        .patch('/v1/users/NonExistingUser/username')
        .send({new_username: 'NewUsername'});

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User does not exist.');
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

  

  describe('DELETE /v1/users/FakeUser1', () => {
    it('handles success', async () => {
      const agent = request.agent(server);

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
