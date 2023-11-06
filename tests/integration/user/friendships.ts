import request from 'supertest';
import type { SuperAgentTest } from 'supertest';

import { server } from '../index.test.js';

export function friendshipsTests() {
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

  describe('POST /v1/users/:username/friendships/:friendname/create', () => {
    it('handles success', async () => {
      const res = await agent
        .post('/v1/users/:username/friendships/:friendname/create');

      expect(res.status).toBe(201);
    });
  });

  describe('PATCH /v1/users/:username/friendships/:friendname/accept', () => {
    it('handles success', async () => {
      const res = await agent
        .patch('/v1/users/:username/friendships/:friendname/accept');

      expect(res.status).toBe(204);
    });
  });

  describe('DELETE /v1/users/:username/friendships/:friendname/reject', () => {
    it('handles success', async () => {
      const res = await agent
        .delete('/v1/users/:username/friendships/:friendname/reject');

      expect(res.status).toBe(204);
    });
  });

  describe('DELETE /v1/users/:username/friendships/:friendname/delete', () => {
    it('handles success', async () => {
      const res = await agent
        .delete('/v1/users/:username/friendships/:friendname/delete');

      expect(res.status).toBe(204);
    });
  });

  describe('POST /v1/users/:username/friendships/:friendname/block', () => {
    it('handles success', async () => {
      const res = await agent
        .post('/v1/users/:username/friendships/:friendname/block');

      expect(res.status).toBe(201);
    });
  });

  describe('DELETE /v1/users/:username/friendships/:friendname/unblock', () => {
    it('handles success', async () => {
      const res = await agent
        .delete('/v1/users/:username/friendships/:friendname/unblock');

      expect(res.status).toBe(204);
    });
  });
}
