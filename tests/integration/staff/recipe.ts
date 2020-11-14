import request from 'supertest';

import { server } from '../index.test';

export function staffRecipeTests() {
  describe('POST /staff/recipe/create', () => {
    it('creates recipe', async () => {
      const { body } = await request(server).post('/staff/recipe/create')
        .send({
          type: "Main",
          cuisine: "Italian",
          title: "Title",
          description: "Description.",
          activeTime: "00:00:04",
          totalTime: "00:04:00",
          directions: "Directions.",
          recipeImage: "recipeImage",
          equipmentImage: "equipmentImage",
          ingredientsImage: "ingredientsImage",
          cookingImage: "cookingImage",
          video: "video"
        });
      expect(body).toEqual({message: 'Recipe created.'});
    });
  });

  describe('PUT /staff/recipe/update', () => {
    it('updates recipe', async () => {
      const { body } = await request(server).put('/staff/recipe/update')
        .send({
          id: "NOBSC Title",
          type: "Main",
          cuisine: "Italian",
          title: "Title",
          description: "Description.",
          activeTime: "00:00:04",
          totalTime: "00:04:00",
          directions: "Directions.",
          recipeImage: "recipeImage",
          equipmentImage: "equipmentImage",
          ingredientsImage: "ingredientsImage",
          cookingImage: "cookingImage",
          video: "video"
        });
      expect(body).toEqual({message: 'Recipe updated.'}); 
    });
  });

  describe('DELETE /staff/recipe/delete', () => {
    it('deletes recipe', async () => {
      const { body } = await request(server).delete('/staff/recipe/delete')
        .send({id: "NOBSC Title"});
      expect(body).toEqual({message: 'Recipe deleted.'});
    });
  });
}