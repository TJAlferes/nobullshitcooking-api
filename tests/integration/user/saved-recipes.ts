import request from 'supertest';
import type { SuperAgentTest } from 'supertest';

import { server } from '../index.test.js';

export function savedRecipesTests() {
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

  describe('GET /v1/users/FakeUser1/saved-recipes', () => {
    it('handles success', async () => {
      const res = await agent.get('/v1/users/FakeUser1/saved-recipes');

      expect(res.status).toBe(200);
    });
  });

  describe('POST /v1/users/FakeUser1/saved-recipes', () => {
    it('handles not found', async () => {
      const res = await agent
        .post('/v1/users/FakeUser1/saved-recipes/018b6942-6b2z-7949-8ab9-3509084cf00z');

      expect(res.status).toBe(404); 
    });

    it('handles forbidden', async () => {
      const res = await agent
        .post('/v1/users/FakeUser1/saved-recipes/018b6942-6b2g-7944-8ab7-3509084cf00f');

      expect(res.status).toBe(403); 
    });

    it('handles success', async () => {
      const res = await agent
        .post('/v1/users/FakeUser1/saved-recipes/pubb6942-6b2g-7944-8ab7-3509084cf00f');

      expect(res.status).toBe(201);
    });
  });

  describe('DELETE /v1/users/FakeUser1/saved-recipes', () => {
    it('handles not found', async () => {
      const res = await agent
        .delete('/v1/users/FakeUser1/saved-recipes/018b6942-6b2z-7949-8ab9-3509084cf00z');

      expect(res.status).toBe(404); 
    });

    it('handles success', async () => {
      const res = await agent
        .delete('/v1/users/FakeUser1/saved-recipes/018b6942-6b2e-7942-8ab5-350bb57371c7');

      expect(res.status).toBe(204); 
    });
  });
}
