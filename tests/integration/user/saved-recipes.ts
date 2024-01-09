import type { Express } from 'express';

import { TestAgent } from '../utils/TestAgent';

export function savedRecipesTests(app: Express) {
  let agent: TestAgent;

  beforeAll(async () => {
    agent = new TestAgent(app);
    await agent.setCsrfToken();
  });

  beforeEach(async () => {
    await agent.post('/v1/login', {
      email: 'fakeuser1@gmail.com',
      password: 'fakepassword'
    });
  });

  afterEach(async () => {
    await agent.post('/v1/logout');
  });

  describe('GET /v1/users/:username/saved-recipes', () => {
    it('handles success', async () => {
      const res = await agent.get('/v1/users/FakeUser1/saved-recipes');
      expect(res.status).toBe(200);
    });
  });

  describe('POST /v1/users/:username/saved-recipes/:recipe_id', () => {
    it('handles success', async () => {
      const res = await agent
        .post('/v1/users/FakeUser1/saved-recipes/11116942-6b3f-7944-8ab7-3509084cf00f');
      expect(res.status).toBe(201);
    });
    
    it('handles not found', async () => {
      const res = await agent
        .post('/v1/users/FakeUser1/saved-recipes/11116942-6b3f-7944-8ab7-3509084c0000');
      expect(res.status).toBe(404); 
    });

    it('handles forbidden', async () => {
      const res = await agent
        .post('/v1/users/FakeUser1/saved-recipes/018b6942-6b3f-7944-8ab7-3509084cf00f');
      expect(res.status).toBe(403); 
    });
  });

  describe('DELETE /v1/users/:username/saved-recipes/:recipe_id', () => {
    it('handles success', async () => {
      const res = await agent
        .delete('/v1/users/FakeUser1/saved-recipes/018b6942-6b2e-7942-8ab5-350a8c183a41');
      expect(res.status).toBe(204); 
    });

    it('handles not found', async () => {
      const res = await agent
        .delete('/v1/users/FakeUser1/saved-recipes/018b6942-6b2e-7942-8ab5-350a8c180000');
      expect(res.status).toBe(404); 
    });
  });
}
