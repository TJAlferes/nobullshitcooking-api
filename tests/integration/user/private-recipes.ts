import request from 'supertest';
import type { SuperAgentTest } from 'supertest';

import { server } from '../index.test.js';

const recipeInfo = {
  recipeTypeId:     4,
  cuisineId:        4,
  title:            "Title",
  description:      "Description.",
  activeTime:       "00:00:04",
  totalTime:        "00:04:00",
  directions:       "Directions.",
  recipeImage:      "recipeImage",
  equipmentImage:   "equipmentImage",
  ingredientsImage: "ingredientsImage",
  cookingImage:     "cookingImage",
  video:            "video"
};

export function privateRecipesTests() {
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

  describe('POST /v1/users/FakeUser1/private-recipes', () => {
    it('handles success', async () => {
      const res = await agent
        .post('/v1/users/FakeUser1/private-recipes')
        .send(recipeInfo);

      expect(res.status).toBe(201);
    });
  });

  describe('PUT /v1/users/FakeUser1/private-recipes', () => {
    it('handles success', async () => {
      const res = await agent
        .put('/v1/users/FakeUser1/private-recipes')
        .send({
          recipe_id: 
          ...recipeInfo
        });

      expect(res.status).toBe(204);
    });
  });

  describe('DELETE /v1/users/FakeUser1/private-recipes/:recipe_id', () => {
    it('handles success', async () => {
      const res = await agent
        .delete('/v1/users/FakeUser1/private-recipes');
      expect(res.status).toBe(204);
    });
  });
}
