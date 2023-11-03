import request from 'supertest';
import type { SuperAgentTest } from 'supertest';

import { server } from '../index.test.js';

export function privateRecipesTests() {
  const recipeInfo = {
    recipe_type_id: 4,
    cuisine_id: 4,
    title: "Title",
    description: "Description.",
    active_time: "00:00:04",
    total_time: "00:04:00",
    directions: "Directions.",
    required_methods: [],
    required_equipment: [],
    required_ingredients: [],
    required_subrecipes: [],
    recipe_image: "recipe_image",
    equipment_image: "equipment_image",
    ingredients_image: "ingredients_image",
    cooking_image: "cooking_image"
  };
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

  describe('GET /v1/users/FakeUser1/private-recipes/:recipe_id/edit', () => {
    it('handles success', async () => {
      const res = await agent
        .get('/v1/users/FakeUser1/private-recipes/018b6942-6b2f-7943-8ab6-3509084cf00e/edit');

      expect(res.status).toBe(200);
    });
  });

  describe('GET /v1/users/FakeUser1/private-recipes/:recipe_id', () => {
    it('handles success', async () => {
      const res = await agent
        .get('/v1/users/FakeUser1/private-recipes/018b6942-6b2f-7943-8ab6-3509084cf00e');

      expect(res.status).toBe(200);
    });
  });

  describe('POST /v1/users/FakeUser1/private-recipes', () => {
    it('handles success', async () => {
      const res = await agent
        .post('/v1/users/FakeUser1/private-recipes')
        .send(recipeInfo);

      expect(res.status).toBe(201);
    });
  });

  describe('PUT /v1/users/FakeUser1/private-recipes', () => {
    it('handles not found', async () => {
      const res = await agent
        .put('/v1/users/FakeUser1/private-recipes')
        .send({
          recipe_id: "018b6942-6b2z-7949-8ab9-3509084cf00z",
          ...recipeInfo
        });

      expect(res.status).toBe(404);
    });

    it('handles forbidden', async () => {
      const res = await agent
        .put('/v1/users/FakeUser1/private-recipes')
        .send({
          recipe_id: "018b6942-6b2g-7944-8ab7-3509084cf00f",
          ...recipeInfo
        });

      expect(res.status).toBe(403);
    });

    it('handles success', async () => {
      const res = await agent
        .put('/v1/users/FakeUser1/private-recipes')
        .send({
          recipe_id: "018b6942-6b2f-7943-8ab6-3509084cf00e",
          ...recipeInfo
        });

      expect(res.status).toBe(204);
    });
  });

  describe('DELETE /v1/users/FakeUser1/private-recipes/:recipe_id', () => {
    it('handles not found', async () => {
      const res = await agent
        .delete('/v1/users/FakeUser1/private-recipes/018b6942-6b2z-7949-8ab9-3509084cf00z');

      expect(res.status).toBe(404);
    });

    it('handles forbidden', async () => {
      const res = await agent
        .delete('/v1/users/FakeUser1/private-recipes/018b6942-6b2g-7944-8ab7-3509084cf00f');

      expect(res.status).toBe(403);
    });

    it('handles success', async () => {
      const res = await agent
        .delete('/v1/users/FakeUser1/private-recipes/018b6942-6b2f-7943-8ab6-3509084cf00e');

      expect(res.status).toBe(204);
    });
  });
}
