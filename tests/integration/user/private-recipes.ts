import request from 'supertest';

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
  describe('POST /user/recipe/create', () => {
    it('creates recipe', async () => {
      const { body } = await request(server).post('/user/recipe/create').send({ownership: "public", ...recipeInfo});
      expect(body).toEqual({message: 'Recipe created.'});
    });
  });

  describe('PUT /user/recipe/update', () => {
    it('updates recipe', async () => {
      const { body } = await request(server).put('/user/recipe/update').send({id: 88, ...recipeInfo});
      expect(body).toEqual({message: 'Recipe updated.'});
    });
  });

  describe('DELETE /user/recipe/delete', () => {
    it('deletes recipe', async () => {
      const { body } = await request(server).delete('/user/recipe/delete').send({id: 88});
      expect(body).toEqual({message: 'Recipe deleted.'});
    });
  });
}
