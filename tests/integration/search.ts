import request from 'supertest';

import { server } from './index.test';

export function searchTests() {
  describe('GET /v1/search/auto/equipment', () => {
    it('handles success', async () => {
      const res = await request(server)
        .get('/v1/search/auto/equipment')
        .query({term: "Knif"});
      expect(res.body).toEqual({
        equipment_id: "018b5ade-5438-7d0c-b42b-f2641487f7cc",
        text:         "Chef's Knife"
      });
    });
  });

  describe('GET /v1/search/auto/ingredients', () => {
    it('handles success', async () => {
      const res = await request(server)
        .get('/v1/search/auto/ingredients')
        .query({term: "Pars"});
      expect(res.body).toEqual([
        {
          ingredient_id: "018b5ade-dc57-70d7-8dda-8f057cab20cf",
          text:          "Parsnips"
        },
        {
          ingredient_id: "018b5ade-dc58-70c4-bf36-2ed85c07e922",
          text:          "Parsley"
        },
      ]);
    });
  });

  describe('GET /v1/search/auto/recipes', () => {
    it('handles success', async () => {
      const res = await request(server)
        .get('/v1/search/auto/recipes')
        .query({term: "stew"});
      expect(res.body).toEqual({
        recipe_id: "018b6561-0467-7121-8665-d01c7aed65bc",
        text:      "Beef Stew"
      });
    });
  });

  describe('GET /v1/search/find/equipment', () => {
    it('handles success', async () => {
      const res = await request(server)
        .get('/v1/search/find/equipment')
        .query({term: "Knife"});
      expect(res.body).toEqual({
        results: [
          {
            "equipment_id": "018b5ade-5438-7d0c-b42b-f2641487f7cc",
            "equipment_type_name": "Preparing",
            "equipment_name": "Chef's Knife",
            "notes": "",
            "image_filename": "chefs-knife"
          },
          {
            "equipment_id": "018b5ade-5438-7d0c-b42b-f26cb737e548",
            "equipment_type_name": "Preparing",
            "equipment_name": "Serated Knife",
            "notes": "",
            "image_filename": "serated-knife"
          },
        ],
        total_results: 2,
        total_pages: 1
      });
    });
  });

  describe('GET /v1/search/find/ingredients', () => {
    it('handles success', async () => {
      const res = await request(server)
        .get('/v1/search/find/ingredients')
        .query({term: "peach"});
      expect(res.body).toEqual({
        results: [
          {
            "ingredient_id": "018b5ade-dc57-70d7-8dda-8f5b2967e377",
            "ingredient_type_name": "Fruit",
            "ingredient_brand": "",
            "ingredient_variety": "",
            "ingredient_name": "Peach",
            "fullname": "Peach",
            "notes": "",
            "image_filename": "peach"
          }
        ],
        total_results: 1,
        total_pages: 1
      });
    });
  });

  describe('GET /v1/search/find/recipes', () => {
    it('handles success', async () => {
      const res = await request(server)
        .get('/v1/search/find/recipes')
        .query({term: "stew"});
      expect(res.body).toEqual({
        results: [
          {
            "recipe_id": "018b6942-6b2e-7942-8ab5-350bb57371c7",
            "author": "NOBSC",
            "recipe_type_name": "Stew",
            "cuisine_name": "Algerian",
            "title": "Beef Stew",
            "description": "Satisfying",
            "image_filename": "beef-stew-recipe"
          }
        ],
        total_results: 1,
        total_pages: 1
      });
    });
  });
}
