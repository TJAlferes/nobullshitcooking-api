import request from 'supertest';

import { server } from './index.test';

export function recipeTests() {
  describe('GET /recipe/:id', () => {
    it('returns data correctly', async () => {
      const { body } = await request(server).get('/recipe/NOBSC%20Borscht');
      expect(body).toEqual({
        id: "NOBSC Borscht",
        author: "NOBSC",
        author_avatar: "nobsc-user-default",
        type: "Drink",
        cuisine: "Afghan",
        title: "Borscht",
        description: "Excellent",
        active_time: "0:30:00",
        total_time: "4:00:00",
        directions: "Chop beets and onions...",
        recipe_image: "nobsc-recipe-default",
        equipment_image: "nobsc-recipe-equipment-default",
        ingredients_image: "nobsc-recipe-ingredients-default",
        cooking_image: "nobsc-recipe-cooking-default",
        video: "video",
        required_methods: [
          {method: "Steam"}
        ],
        required_equipment: [
          {amount: 1, equipment: "Ceramic Stone"}
        ],
        required_ingredients: [
          {amount: 4.00, ingredient: "Chicken Breasts", measurement: "teaspoon"}
        ],
        required_subrecipes: null
      });
    });
  });
}