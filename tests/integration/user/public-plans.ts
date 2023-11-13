import request from 'supertest';
import type { SuperAgentTest } from 'supertest';

import { server } from '../index.test';

export function publicPlansTests() {
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

  describe('POST /v1/users/FakeUser1/public-plans', () => {
    it('handles success', async () => {
      const res = await agent
        .post('/v1/users/FakeUser1/public-plans')
        .send({
          plan_name: "Name",
          included_recipes: [

          ]
        });
      
      expect(res.status).toBe(201);
    });
  });

  describe('PATCH /v1/users/FakeUser1/public-plans', () => {
    it('handles not found', async () => {
      const res = await agent
        .patch('/v1/users/FakeUser1/public-plans')
        .send({
          plan_id: "pubb6942-973z-8y4z-0e4s-3509084crk2z",
          plan_name: "Updated Name",
          included_recipes: [
            
          ]
        });
      
      expect(res.status).toBe(204);
    });

    it('handles forbidden', async () => {
      const res = await agent
        .patch('/v1/users/FakeUser1/public-plans')
        .send({
          plan_id: "pubb6942-973w-8y4i-0e4s-3509084crk2b",
          plan_name: "Updated Name",
          included_recipes: [
            
          ]
        });
      
      expect(res.status).toBe(204);
    });

    it('handles success', async () => {
      const res = await agent
        .patch('/v1/users/FakeUser1/public-plans')
        .send({
          plan_id: "pubb6942-973v-8y4h-0e4r-3509084crk2a",
          plan_name: "Updated Name",
          included_recipes: [
            
          ]
        });
      
      expect(res.status).toBe(204);
    });
  });

  describe('DELETE /v1/users/FakeUser1/public-plans', () => {
    it('handles not found', async () => {
      const res = await agent
        .delete('/v1/users/FakeUser1/private-plans/pubb6942-973z-8y4z-0e4s-3509084crk2z');
      
      expect(res.status).toBe(404);
    });

    it('handles forbidden', async () => {
      const res = await agent
        .delete('/v1/users/FakeUser1/private-plans/pubb6942-973w-8y4i-0e4s-3509084crk2b');
      
      expect(res.status).toBe(403);
    });

    it('handles success', async () => {
      const res = await agent
        .delete('/v1/users/FakeUser1/public-plans/pubb6942-973v-8y4h-0e4r-3509084crk2a');
      
      expect(res.status).toBe(204);
    });
  });
}
