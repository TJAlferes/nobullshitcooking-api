import { Request, Response } from 'express';
import { assert, create }    from 'superstruct';

import { EquipmentRepo }  from '../equipment/repo.js';
import { IngredientRepo } from '../ingredient/repo.js';
import { RecipeRepo }     from '../recipe/repo.js';
import { validSearchTerm, validSearchRequest } from './model.js';

export const searchController = {
  async autosuggestEquipment(req: Request, res: Response) {
    const { term } = req.query;

    assert(term, validSearchTerm);
    const repo = new EquipmentRepo();
    const found = await repo.autosuggest(term);

    return res.json({found});
  },

  async autosuggestIngredients(req: Request, res: Response) {
    const { term } = req.query;

    assert(term, validSearchTerm);
    const repo = new IngredientRepo();
    const found = await repo.autosuggest(term);

    return res.json({found});
  },

  async autosuggestRecipes(req: Request, res: Response) {
    const { term } = req.query;

    assert(term, validSearchTerm);
    const repo = new RecipeRepo();
    const found = await repo.autosuggest(term);

    return res.json({found});
  },

  async searchEquipment(req: Request, res: Response) {
    const { term, filters, sorts, currentPage, resultsPerPage } = req.query;

    const searchRequest = create({term, filters, sorts, currentPage, resultsPerPage}, validSearchRequest);
    const repo = new EquipmentRepo();
    const found = await repo.search(searchRequest);

    return res.json({found});
  },

  async searchIngredients(req: Request, res: Response) {
    const { term, filters, sorts, currentPage, resultsPerPage } = req.query;

    const searchRequest = create({term, filters, sorts, currentPage, resultsPerPage}, validSearchRequest);
    const repo = new IngredientRepo();
    const found = await repo.search(searchRequest);

    return res.json({found});
  },

  async searchRecipes(req: Request, res: Response) {
    const { term, filters, sorts, currentPage, resultsPerPage } = req.query;

    const searchRequest = create({term, filters, sorts, currentPage, resultsPerPage}, validSearchRequest);
    const repo = new RecipeRepo();
    const found = await repo.search(searchRequest);

    return res.json({found});
  }
};
