import request from 'supertest';

import { server } from './index.test.js';

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
        recipe_id: string;
        text:      "Irish Guinness Beef Stew"
      });
    });
  });

  describe('GET /v1/search/find/equipment', () => {
    it('handles success', async () => {
      const res = await request(server)
        .get('/v1/search/find/equipment')
        .query({

        });
      expect(res.body).toEqual({});
    });
  });

  describe('GET /v1/search/find/ingredients', () => {
    it('handles success', async () => {
      const res = await request(server)
        .get('/v1/search/find/ingredients')
        .query({

        });
      expect(res.body).toEqual({});
    });
  });

  describe('GET /v1/search/find/recipes', () => {
    it('handles success', async () => {
      const res = await request(server)
        .get('/v1/search/find/recipes')
        .query({

        });
      expect(res.body).toEqual({});
    });
  });
}
