import request from 'supertest';
import type { SuperAgentTest } from 'supertest';
import type { Express } from 'express';

export function privatePlansTests(app: Express) {
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

  describe('POST /v1/users/FakeUser1/private-plans', () => {
    it('handles success', async () => {
      const res = await agent
        .post('/v1/users/FakeUser1/private-plans')
        .send({
          plan_name: "Name",
          included_recipes: [

          ]
        });
      
      expect(res.status).toBe(201);
    });
  });

  describe('PATCH /v1/users/FakeUser1/private-plans', () => {
    it('handles not found', async () => {
      const res = await agent
        .patch('/v1/users/FakeUser1/private-plans')
        .send({
          plan_id: "018b6942-973a-8b4f-0e4f-3509084c0000",
          plan_name: "Updated Name",
          included_recipes: [
            
          ]
        });
      
      expect(res.status).toBe(404);
    });

    it('handles forbidden', async () => {
      const res = await agent
        .patch('/v1/users/FakeUser1/private-plans')
        .send({
          plan_id: "018b6942-973b-8b4f-0e4f-3509084cff2b",
          plan_name: "Updated Name",
          included_recipes: [
            
          ]
        });
      
      expect(res.status).toBe(403);
    });

    it('handles success', async () => {
      const res = await agent
        .patch('/v1/users/FakeUser1/private-plans')
        .send({
          plan_id: "018b6942-973a-8b4f-0e4f-3509084cff2a",
          plan_name: "Updated Name",
          included_recipes: [
            
          ]
        });
      
      expect(res.status).toBe(204);
    });
  });

  describe('DELETE /v1/users/FakeUser1/private-plans', () => {
    it('handles not found', async () => {
      const res = await agent
        .delete('/v1/users/FakeUser1/private-plans/018b6942-973a-8b4f-0e4f-3509084c0000');
      
      expect(res.status).toBe(404);
    });

    it('handles forbidden', async () => {
      const res = await agent
        .delete('/v1/users/FakeUser1/private-plans/018b6942-973b-8b4f-0e4f-3509084cff2b');
      
      expect(res.status).toBe(403);
    });

    it('handles success', async () => {
      const res = await agent
        .delete('/v1/users/FakeUser1/private-plans/018b6942-973a-8b4f-0e4f-3509084cff2a');
      
      expect(res.status).toBe(204);
    });
  });
}
