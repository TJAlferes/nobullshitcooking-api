import request from 'supertest';

import { server } from './index.test';

export function recipesTests() {
  describe('GET /v1/recipes/:title', () => {
    it('returns data correctly', async () => {
      const res = await request(server).get('/v1/recipes/beef-stew');
      expect(res.body).toEqual({
        recipe_id:         "018b6942-6b2e-7942-8ab5-350bb57371c7",
        author_id:         "11111111-1111-1111-1111-111111111111",
        author:            "NOBSC",
        author_avatar:     "nobsc",
        recipe_type_name:  "Stew",
        cuisine_name:      "Algerian",
        title:             "Beef Stew",
        description:       "Satisfying",
        active_time:       "0:30:00",
        total_time:        "4:00:00",
        directions:        "Sear beef...",

        recipe_image:      "beef-stew-recipe",
        equipment_image:   "beef-stew-equipment",
        ingredients_image: "beef-stew-ingredients",
        cooking_image:     "beef-stew-cooking",
        
        required_methods:     [
          {
            method_name: "No-Cook"
          }
        ],
        required_equipment:   [
          {
            amount:         1,
            equipment_name: "Chef's Knife"
          }
        ],
        required_ingredients: [
          {
            amount:              1,
            unit_name:           "teaspoon",
            ingredient_fullname: "Onion"
          }
        ],
        required_subrecipes:  []
      });
    });
  });
}
