import type { Express } from 'express';

import { TestAgent } from '../utils/TestAgent';

export function friendshipsTests(app: Express) {
  let agent: TestAgent;
  let agent2: TestAgent;

  beforeAll(async () => {
    agent = new TestAgent(app);
    await agent.setCsrfToken();
    agent2 = new TestAgent(app);
    await agent2.setCsrfToken();
  });

  beforeEach(async () => {
    await agent.post('/v1/login', {
      email: 'fakeuser1@gmail.com',
      password: 'fakepassword'
    });
    await agent2.post('/v1/login', {
      email: 'fakeuser2@gmail.com',
      password: 'fakepassword'
    });
  });

  afterEach(async () => {
    await agent.post('/v1/logout');
    await agent2.post('/v1/logout');
  });

  describe('POST /v1/users/:username/friendships/:friendname/create', () => {
    it('handles success', async () => {
      const res = await agent.post('/v1/users/FakeUser1/friendships/FakeUser2/create');
      expect(res.status).toBe(201);
    });

    it('handles not found', async () => {
      const res = await agent.post('/v1/users/FakeUser1/friendships/NonExistingUser/create');
      expect(res.status).toBe(404);
    });

    it('handles blocked by', async () => {
      await agent2.post('/v1/users/FakeUser2/friendships/FakeUser1/block');
      const res = await agent.post('/v1/users/FakeUser1/friendships/FakeUser2/create');
      expect(res.status).toBe(404);
    });

    it('handles already pending sent', async () => {
      await agent.post('/v1/users/FakeUser1/friendships/FakeUser2/create');
      const res = await agent.post('/v1/users/FakeUser1/friendships/FakeUser2/create');
      expect(res.status).toBe(403);
    });

    it('handles already pending received', async () => {
      await agent2.post('/v1/users/FakeUser2/friendships/FakeUser1/create');
      const res = await agent.post('/v1/users/FakeUser1/friendships/FakeUser2/create');
      expect(res.status).toBe(403);
    });

    it('handles already friends', async () => {
      await agent2.post('/v1/users/FakeUser2/friendships/FakeUser1/create');
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
    it('handles success', async () => {
      await agent2.post('/v1/users/FakeUser2/friendships/FakeUser1/create');
      const res = await agent.patch('/v1/users/FakeUser1/friendships/FakeUser2/accept');
      expect(res.status).toBe(204);
    });

    it('handles not found', async () => {
      const res = await agent.patch('/v1/users/FakeUser1/friendships/NonExistingUser/accept');
      expect(res.status).toBe(404);
    });

    it('handles forbidden', async () => {
      await agent2.post('/v1/users/FakeUser2/friendships/FakeUser1/block');
      const res = await agent.patch('/v1/users/FakeUser1/friendships/FakeUser2/accept');
      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /v1/users/:username/friendships/:friendname/reject', () => {
    it('handles success', async () => {
      await agent2.post('/v1/users/FakeUser2/friendships/FakeUser1/create');
      const res = await agent.delete('/v1/users/FakeUser1/friendships/FakeUser2/reject');
      expect(res.status).toBe(204);
    });

    it('handles not found', async () => {
      const res = await agent.delete('/v1/users/FakeUser1/friendships/NonExistingUser/reject');
      expect(res.status).toBe(404);
    });

    it('handles forbidden', async () => {
      await agent2.post('/v1/users/FakeUser2/friendships/FakeUser1/block');
      const res = await agent.delete('/v1/users/FakeUser1/friendships/FakeUser2/reject');
      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /v1/users/:username/friendships/:friendname/delete', () => {
    it('handles success', async () => {
      await agent2.post('/v1/users/FakeUser2/friendships/FakeUser1/create');
      await agent.patch('/v1/users/FakeUser1/friendships/FakeUser2/accept');
      const res = await agent.delete('/v1/users/FakeUser1/friendships/FakeUser2/delete');
      expect(res.status).toBe(204);
    });

    it('handles not found', async () => {
      const res = await agent.delete('/v1/users/FakeUser1/friendships/NonExistingUser/delete');
      expect(res.status).toBe(404);
    });

    it('handles forbidden', async () => {
      await agent2.post('/v1/users/FakeUser2/friendships/FakeUser1/block');
      const res = await agent.delete('/v1/users/FakeUser1/friendships/FakeUser2/delete');
      expect(res.status).toBe(403);
    });
  });

  describe('POST /v1/users/:username/friendships/:friendname/block', () => {
    it('handles success', async () => {
      const res = await agent.post('/v1/users/FakeUser1/friendships/FakeUser2/block');
      expect(res.status).toBe(201);
    });

    it('handles not found', async () => {
      const res = await agent.post('/v1/users/FakeUser1/friendships/NonExistingUser/block');
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /v1/users/:username/friendships/:friendname/unblock', () => {
    it('handles success', async () => {
      await agent.post('/v1/users/FakeUser1/friendships/FakeUser2/block');
      const res = await agent.delete('/v1/users/FakeUser1/friendships/FakeUser2/unblock');
      expect(res.status).toBe(204);
    });

    it('handles not found', async () => {
      const res = await agent.delete('/v1/users/FakeUser1/friendships/NonExistingUser/unblock');
      expect(res.status).toBe(404);
    });

    it('handles forbidden', async () => {
      await agent.post('/v1/users/FakeUser1/friendships/FakeUser2/create');
      const res = await agent.delete('/v1/users/FakeUser1/friendships/FakeUser2/unblock');
      expect(res.status).toBe(403);
    });
  });
}
