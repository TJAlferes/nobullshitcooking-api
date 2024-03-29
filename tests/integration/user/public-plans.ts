import type { Express } from 'express';

import { TestAgent } from '../utils/TestAgent';

export function publicPlansTests(app: Express) {
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

  describe('GET /v1/users/:username/public-plans/:plan_name', () => {
    it.only('handles success', async () => {
      const res = await agent.get('/v1/users/FakeUser1/public-plans/Public%20Plan');
      expect(res.status).toBe(200);
      expect(res.body.included_recipes).toEqual({
        1: [
          {
            recipe_id: '11116942-6b2f-7943-8ab6-3509084cf00e',
            author_id: "33333333-3333-3333-3333-333333333333",
            owner_id: "11111111-1111-1111-1111-111111111111",
            recipe_type_id: 3,
            cuisine_id: 1,
            author: "FakeUser1",
            title: "Public Grilled Chicken",
            image_filename: "grilled-chicken-recipe",
          }
        ],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: []
      });
    });
  });

  describe('POST /v1/users/:username/public-plans', () => {
    it('handles success', async () => {
      const res = await agent
        .post('/v1/users/FakeUser1/public-plans', {
          plan_name: 'Plan Name',
          included_recipes: [
            {
              recipe_id: '11116942-6b2f-7943-8ab6-3509084cf00e',
              day_number: 3,
              recipe_number: 1
            },
            {
              recipe_id: '11116942-6b2f-7943-8ab6-3509084cf00e',
              day_number: 6,
              recipe_number: 1
            }
          ]
        });
      
      expect(res.status).toBe(201);
    });
  });

  describe('PATCH /v1/users/:username/public-plans', () => {
    const included_recipes = [
      {
        recipe_id: '11116942-6b2f-7943-8ab6-3509084cf00e',
        day_number: 1,
        recipe_number: 1
      },
      {
        recipe_id: '11116942-6b2f-7943-8ab6-3509084cf00e',
        day_number: 4,
        recipe_number: 1
      }
    ];

    it('handles success', async () => {
      const res = await agent
        .patch('/v1/users/FakeUser1/public-plans', {
          plan_id: '11116942-973a-8b4f-0e4f-3509084cff2a',
          plan_name: 'Updated Name',
          included_recipes
        });
      
      expect(res.status).toBe(204);
    });

    it('handles not found', async () => {
      const res = await agent
        .patch('/v1/users/FakeUser1/public-plans', {
          plan_id: '11116942-973a-8b4f-0e4f-3509084c0000',
          plan_name: 'Updated Name',
          included_recipes
        });
      
      expect(res.status).toBe(404);
    });

    it('handles forbidden', async () => {
      const res = await agent
        .patch('/v1/users/FakeUser1/public-plans', {
          plan_id: '11116942-973b-8b4f-0e4f-3509084cff2b',
          plan_name: 'Updated Name',
          included_recipes
        });
      
      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /v1/users/:username/public-plans/:plan_id', () => {
    it('handles success', async () => {
      const res = await agent
        .delete('/v1/users/FakeUser1/public-plans/11116942-973a-8b4f-0e4f-3509084cff2a');
      expect(res.status).toBe(204);
    });

    it('handles not found', async () => {
      const res = await agent
        .delete('/v1/users/FakeUser1/public-plans/11116942-973a-8b4f-0e4f-3509084c0000');
      expect(res.status).toBe(404);
    });

    it('handles forbidden', async () => {
      const res = await agent
        .delete('/v1/users/FakeUser1/public-plans/11116942-973b-8b4f-0e4f-3509084cff2b');
      expect(res.status).toBe(403);
    });
  });
}
