import request from 'supertest';

import { server } from './index.test';

export function recipeTests() {
  describe('GET /recipe/1', () => {
    it('returns data correctly', async () => {
      const { body } = await request(server).get('/recipe/1');
      expect(body).toEqual({
        id: 1,
        author: "NOBSC",
        author_avatar: "nobsc-user-default",
        recipe_type_name: "Drink",
        cuisine_name: "Afghan",
        title: "Borscht",
        description: "Excellent",
        active_time: "0:30:00",
        total_time: "4:00:00",
        directions: "Chop beets and onions...",
        recipe_image: "nobsc-recipe-default",
        equipment_image: "nobsc-recipe-equipment-default",
        ingredients_image: "nobsc-recipe-ingredients-default",
        cooking_image: "nobsc-recipe-cooking-default",
        required_methods: [{method_name: "Steam"}],
        required_equipment: [{amount: 1, equipment_name: "Ceramic Stone"}],
        required_ingredients: [
          {
            amount: 4.00,
            ingredient_name: "Chicken Breasts",
            measurement_name: "teaspoon"
          }
        ],
        required_subrecipes: null
      });
    });
  });
}