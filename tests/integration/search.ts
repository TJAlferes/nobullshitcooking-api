import request from 'supertest';
import type { Express } from 'express';

export function searchTests(app: Express) {
  describe('GET /v1/search/auto?index=equipment', () => {
    it('handles success', async () => {
      const res = await request(app)
        .get('/v1/search/auto')
        .query({
          index: 'equipment',
          term: 'Knif'
        });

      expect(res.body).toEqual([
        {
          id: '018b5ade-5438-7d0c-b42b-f2641487f7cc',
          text: "Chef's Knife"
        },
        {
          id: '018b5ade-5438-7d0c-b42b-f26cb737e548',
          text: 'Serated Knife'
        }
      ]);
    });
  });

  describe('GET /v1/search/auto?index=ingredients', () => {
    it('handles success', async () => {
      const res = await request(app)
        .get('/v1/search/auto')
        .query({
          index: 'ingredients',
          term: 'Pars'
        });

      expect(res.body).toEqual([
        {
          id: '018b5ade-dc57-70d7-8dda-8f057cab20cf',
          text: 'Parsnips'
        },
        {
          id: '018b5ade-dc58-70c4-bf36-2ed85c07e922',
          text: 'Parsley'
        },
      ]);
    });
  });

  describe('GET /v1/search/auto?index=recipes', () => {
    it('handles success', async () => {
      const res = await request(app)
        .get('/v1/search/auto')
        .query({
          index: 'recipes',
          term: 'stew'
        });

      expect(res.body).toEqual([
        {
          id: '018b6942-6b2e-7942-8ab5-350bb57371c7',
          text: 'Beef Stew'
        }
      ]);
    });
  });
  
  // TO DO: add filters and sorts tests

  describe('GET /v1/search/find?index=equipment', () => {
    it('handles success', async () => {
      const res = await request(app)
        .get('/v1/search/find')
        .query({
          index: 'equipment',
          term: 'Knife'
        });

      expect(res.body).toEqual({
        results: [
          {
            equipment_id: '018b5ade-5438-7d0c-b42b-f2641487f7cc',
            equipment_type_name: 'Preparing',
            equipment_name: "Chef's Knife",
            notes: '',
            image_filename: 'chefs-knife'
          },
          {
            equipment_id: '018b5ade-5438-7d0c-b42b-f26cb737e548',
            equipment_type_name: 'Preparing',
            equipment_name: 'Serated Knife',
            notes: '',
            image_filename: 'serated-knife'
          },
        ],
        total_results: 2,
        total_pages: 1
      });
    });
  });

  describe('GET /v1/search/find?index=ingredients', () => {
    it('handles success', async () => {
      const res = await request(app)
        .get('/v1/search/find')
        .query({
          index: 'ingredients',
          term: 'peach'
        });

      expect(res.body).toEqual({
        results: [
          {
            ingredient_id: '018b5ade-dc57-70d7-8dda-8f5b2967e377',
            ingredient_type_name: 'Fruit',
            ingredient_brand: '',
            ingredient_variety: '',
            ingredient_name: 'Peach',
            fullname: 'Peach',
            notes: '',
            image_filename: 'peach'
          }
        ],
        total_results: 1,
        total_pages: 1
      });
    });
  });

  describe('GET /v1/search/find?index=recipes', () => {
    it('handles success', async () => {
      const res = await request(app)
        .get('/v1/search/find')
        .query({
          index: 'recipes',
          term: 'stew'
        });

      expect(res.body).toEqual({
        results: [
          {
            recipe_id: '018b6942-6b2e-7942-8ab5-350bb57371c7',
            author: 'NOBSC',
            recipe_type_name: 'Stew',
            cuisine_name: 'Algerian',
            title: 'Beef Stew',
            description: 'Satisfying',
            image_filename: 'beef-stew-recipe'
          }
        ],
        total_results: 1,
        total_pages: 1
      });
    });
  });
}
