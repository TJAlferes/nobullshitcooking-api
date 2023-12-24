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

  describe('POST /v1/users/:username/private-plans', () => {
    it('handles success', async () => {
      const res = await agent
        .post('/v1/users/FakeUser1/private-plans')
        .send({
          plan_name: 'Name',
          included_recipes: [
            {
              recipe_id: '018b6942-6b2f-7943-8ab6-3509084cf00e',
              day_number: 3,
              recipe_number: 1
            },
            {
              recipe_id: '018b6942-6b2f-7943-8ab6-3509084cf00e',
              day_number: 6,
              recipe_number: 1
            }
          ]
        });
      
      expect(res.status).toBe(201);
    });
  });

  describe('PATCH /v1/users/:username/private-plans', () => {
    const included_recipes = [
      {
        recipe_id: '018b6942-6b2f-7943-8ab6-3509084cf00e',
        day_number: 1,
        recipe_number: 1
      },
      {
        recipe_id: '018b6942-6b2f-7943-8ab6-3509084cf00e',
        day_number: 4,
        recipe_number: 1
      }
    ];

    it('handles success', async () => {
      const res = await agent
        .patch('/v1/users/FakeUser1/private-plans')
        .send({
          plan_id: '018b6942-973a-8b4f-0e4f-3509084cff2a',
          plan_name: 'Updated Name',
          included_recipes
        });
      
      expect(res.status).toBe(204);
    });

    it('handles not found', async () => {
      const res = await agent
        .patch('/v1/users/FakeUser1/private-plans')
        .send({
          plan_id: '018b6942-973a-8b4f-0e4f-3509084c0000',
          plan_name: 'Updated Name',
          included_recipes
        });
      
      expect(res.status).toBe(404);
    });

    it('handles forbidden', async () => {
      const res = await agent
        .patch('/v1/users/FakeUser1/private-plans')
        .send({
          plan_id: '018b6942-973b-8b4f-0e4f-3509084cff2b',
          plan_name: 'Updated Name',
          included_recipes
        });
      
      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /v1/users/:username/private-plans/:plan_id', () => {
    it('handles success', async () => {
      const res = await agent
        .delete('/v1/users/FakeUser1/private-plans/018b6942-973a-8b4f-0e4f-3509084cff2a');
      
      expect(res.status).toBe(204);
    });

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
  });
}
