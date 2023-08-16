import { Request, Response } from 'express';
import { assert, create }    from 'superstruct';

import { EquipmentRepo } from '../equipment/repo';
import { IngredientRepo } from '../ingredient/repo';
import { RecipeRepo } from '../recipe/repo';
import { validSearchTerm, validSearchRequest } from './model';

export class SearchController {
  async autosuggestEquipment(req: Request, res: Response) {
    const { term } = req.query;
    assert(term, validSearchTerm);
    const repo = new EquipmentRepo();
    const found = await repo.autosuggest(term);
    return res.json({found});
  }

  async autosuggestIngredients(req: Request, res: Response) {
    const { term } = req.query;
    assert(term, validSearchTerm);
    const repo = new IngredientRepo();
    const found = await repo.autosuggest(term);
    return res.json({found});
  }

  async autosuggestRecipes(req: Request, res: Response) {
    const { term } = req.query;
    assert(term, validSearchTerm);
    const repo = new RecipeRepo();
    const found = await repo.autosuggest(term);
    return res.json({found});
  }

  async searchEquipment(req: Request, res: Response) {
    const { term, filters, sorts, currentPage, resultsPerPage } = req.query;
    const searchRequest = create({term, filters, sorts, currentPage, resultsPerPage}, validSearchRequest);
    const repo = new EquipmentRepo();
    const found = await repo.search(searchRequest);
    return res.json({found});
  }

  async searchIngredients(req: Request, res: Response) {
    const { term, filters, sorts, currentPage, resultsPerPage } = req.query;
    const searchRequest = create({term, filters, sorts, currentPage, resultsPerPage}, validSearchRequest);
    const repo = new IngredientRepo();
    const found = await repo.search(searchRequest);
    return res.json({found});
  }

  async searchRecipes(req: Request, res: Response) {
    const { term, filters, sorts, currentPage, resultsPerPage } = req.query;
    const searchRequest = create({term, filters, sorts, currentPage, resultsPerPage}, validSearchRequest);
    const repo = new RecipeRepo();
    const found = await repo.search(searchRequest);
    return res.json({found});
  }
}
