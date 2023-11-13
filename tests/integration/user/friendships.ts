import request from 'supertest';
import type { SuperAgentTest } from 'supertest';

import { server } from '../index.test';

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
    it('handles not found', async () => {
      const res = await agent.post('/v1/users/FakeUser1/friendships/NonExistingUser/create');
      expect(res.status).toBe(404);
    });

    it('handles blocked by', async () => {
      await agent.post('/v1/users/FakeUser2/friendships/FakeUser1/block');
      const res = await agent.post('/v1/users/FakeUser1/friendships/FakeUser2/create');
      expect(res.status).toBe(404);
    });

    it('handles success', async () => {
      const res = await agent.post('/v1/users/FakeUser1/friendships/FakeUser2/create');
      expect(res.status).toBe(201);
    });

    it('handles already pending sent', async () => {
      await agent.post('/v1/users/FakeUser1/friendships/FakeUser2/create');
      const res = await agent.post('/v1/users/FakeUser1/friendships/FakeUser2/create');
      expect(res.status).toBe(403);
    });

    it('handles already pending received', async () => {
      await agent.post('/v1/users/FakeUser2/friendships/FakeUser1/create');
      const res = await agent.post('/v1/users/FakeUser1/friendships/FakeUser2/create');
      expect(res.status).toBe(403);
    });

    it('handles already friends', async () => {
      await agent.post('/v1/users/FakeUser2/friendships/FakeUser1/create');
      await agent.patch('/v1/users/FakeUser1/friendships/FakeUser2/accept');
      const res = await agent.post('/v1/users/FakeUser1/friendships/FakeUser2/create');
      expect(res.status).toBe(403);
    });

    it('handles blocked', async () => {
      await agent.post('/v1/users/FakeUser1/friendships/FakeUser2/block');
      const res = await agent.post('/v1/users/FakeUser1/friendships/FakeUser2/create');
      expect(res.status).toBe(403);
    });
  });

  describe('PATCH /v1/users/:username/friendships/:friendname/accept', () => {
    it('handles not found', async () => {
      const res = await agent.patch('/v1/users/FakeUser1/friendships/NonExistingUser/accept');
      expect(res.status).toBe(404);
    });

    it('handles forbidden', async () => {
      await agent.post('/v1/users/FakeUser2/friendships/FakeUser1/block');
      const res = await agent.patch('/v1/users/FakeUser1/friendships/FakeUser2/accept');
      expect(res.status).toBe(403);
    });

    it('handles success', async () => {
      await agent.post('/v1/users/FakeUser2/friendships/FakeUser1/create');
      const res = await agent.patch('/v1/users/FakeUser1/friendships/FakeUser2/accept');
      expect(res.status).toBe(204);
    });
  });

  describe('DELETE /v1/users/:username/friendships/:friendname/reject', () => {
    it('handles not found', async () => {
      const res = await agent.delete('/v1/users/FakeUser1/friendships/NonExistingUser/reject');
      expect(res.status).toBe(404);
    });

    it('handles forbidden', async () => {
      await agent.post('/v1/users/FakeUser2/friendships/FakeUser1/block');
      const res = await agent.delete('/v1/users/FakeUser1/friendships/FakeUser2/reject');
      expect(res.status).toBe(403);
    });

    it('handles success', async () => {
      await agent.post('/v1/users/FakeUser2/friendships/FakeUser1/create');
      const res = await agent.delete('/v1/users/FakeUser1/friendships/FakeUser2/reject');
      expect(res.status).toBe(204);
    });
  });

  describe('DELETE /v1/users/:username/friendships/:friendname/delete', () => {
    it('handles not found', async () => {
      const res = await agent.delete('/v1/users/FakeUser1/friendships/NonExistingUser/delete');
      expect(res.status).toBe(404);
    });

    it('handles forbidden', async () => {
      await agent.post('/v1/users/FakeUser2/friendships/FakeUser1/block');
      const res = await agent.delete('/v1/users/FakeUser1/friendships/FakeUser2/delete');
      expect(res.status).toBe(403);
    });

    it('handles success', async () => {
      await agent.post('/v1/users/FakeUser2/friendships/FakeUser1/create');
      await agent.post('/v1/users/FakeUser1/friendships/FakeUser2/accept');
      const res = await agent.delete('/v1/users/FakeUser1/friendships/FakeUser2/delete');
      expect(res.status).toBe(204);
    });
  });

  describe('POST /v1/users/:username/friendships/:friendname/block', () => {
    it('handles not found', async () => {
      const res = await agent.post('/v1/users/FakeUser1/friendships/NonExistingUser/block');
      expect(res.status).toBe(404);
    });

    it('handles success', async () => {
      const res = await agent.post('/v1/users/FakeUser1/friendships/FakeUser2/block');
      expect(res.status).toBe(201);
    });
  });

  describe('DELETE /v1/users/:username/friendships/:friendname/unblock', () => {
    it('handles not found', async () => {
      const res = await agent.delete('/v1/users/FakeUser1/friendships/NonExistingUser/unblock');
      expect(res.status).toBe(404);
    });

    it('handles forbidden', async () => {
      await agent.post('/v1/users/FakeUser1/friendships/FakeUser2/create');
      const res = await agent.delete('/v1/users/FakeUser1/friendships/FakeUser2/unblock');
      expect(res.status).toBe(403);
    });

    it('handles success', async () => {
      await agent.post('/v1/users/FakeUser1/friendships/FakeUser2/block');
      const res = await agent.delete('/v1/users/FakeUser1/friendships/FakeUser2/unblock');
      expect(res.status).toBe(204);
    });
  });
}
