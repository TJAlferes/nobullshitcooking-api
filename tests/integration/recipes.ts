import request from 'supertest';
import type { Express } from 'express';

export function recipesTests(app: Express) {
  describe('GET /v1/recipes/:title', () => {
    it('handles success', async () => {
      const res = await request(app).get('/v1/recipes/Beef%20Stew');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        recipe_id: '018b6942-6b2e-7942-8ab5-350bb57371c7',
        author_id: '11111111-1111-1111-1111-111111111111',
        author: 'NOBSC',
        author_avatar: 'default',
        owner_id: '11111111-1111-1111-1111-111111111111',
        recipe_type_name: 'Stew',
        cuisine_name: 'Algerian',
        title: 'Beef Stew',
        description: 'Satisfying',
        active_time: '00:30:00',
        total_time: '04:00:00',
        directions: 'Sear beef...',
        recipe_image: {
          image_id: '018b6942-6b2e-7942-8ab5-3505f0621d90',
          image_filename: 'beef-stew-recipe',
          caption: ''
        },
        equipment_image: {
          image_id: '018b6942-6b2e-7942-8ab5-3506dce11378',
          image_filename: 'beef-stew-equipment',
          caption: ''
        },
        ingredients_image: {
          image_id: '018b6942-6b2e-7942-8ab5-3507bc34ba22',
          image_filename: 'beef-stew-ingredients',
          caption: ''
        },
        cooking_image: {
          image_id: '018b6942-6b2e-7942-8ab5-3508177f4252',
          image_filename: 'beef-stew-cooking',
          caption: ''
        },
        required_methods: [
          {
            method_name: 'No-Cook'
          }
        ],
        required_equipment: [
          {
            amount: 1,
            equipment_name: "Chef's Knife"
          }
        ],
        required_ingredients: [
          {
            amount: 1,
            unit_name: 'teaspoon',
            ingredient_fullname: 'Onion'
          }
        ],
        required_subrecipes: null
      });
    });

    it('handles not found', async () => {
      const res = await request(app).get('/v1/recipes/Non%20Existing');

      expect(res.status).toBe(404);
    });
  });
}
