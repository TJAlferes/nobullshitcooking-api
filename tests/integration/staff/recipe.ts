import request from 'supertest';

import { server } from '../index.test';

export function staffRecipeTests() {
  describe('POST /staff/recipe/create', () => {
    it('creates recipe', async () => {
      const { body } = await request(server).post('/staff/recipe/create')
        .send({
          recipeTypeId: 4,
          cuisineId: 4,
          title: "Title",
          description: "Description.",
          activeTime: "00:00:04",
          totalTime: "00:04:00",
          directions: "Directions.",
          recipeImage: "recipeImage",
          equipmentImage: "equipmentImage",
          ingredientsImage: "ingredientsImage",
          cookingImage: "cookingImage",
          ownership: "public"
        });
      expect(body).toEqual({message: 'Recipe created.'});
    });
  });

  describe('PUT /staff/recipe/update', () => {
    it('updates recipe', async () => {
      const { body } = await request(server).put('/staff/recipe/update')
        .send({
          id: 88,
          recipeTypeId: 4,
          cuisineId: 4,
          title: "Title",
          description: "Description.",
          activeTime: "00:00:04",
          totalTime: "00:04:00",
          directions: "Directions.",
          recipeImage: "recipeImage",
          equipmentImage: "equipmentImage",
          ingredientsImage: "ingredientsImage",
          cookingImage: "cookingImage"
        });
      expect(body).toEqual({message: 'Recipe updated.'}); 
    });
  });

  describe('DELETE /staff/recipe/delete', () => {
    it('deletes recipe', async () => {
      const { body } = await request(server).delete('/staff/recipe/delete')
        .send({id: 88});
      expect(body).toEqual({message: 'Recipe deleted.'});
    });
  });
}