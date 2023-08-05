import { Request, Response } from 'express';
import { assert, create }    from 'superstruct';

import { EquipmentRepo, IngredientRepo, RecipeRepo } from '../access/mysql';
import { validSearchTerm, validSearchRequest }       from '../lib/validations';

// "auto" here means "autosuggest" (live search suggestions)

export class SearchController {
  async autoEquipment(req: Request, res: Response) {
    const { term } = req.query;
    assert(term, validSearchTerm);
    const repo = new EquipmentRepo();
    const found = await repo.autosuggest(term);
    return res.json({found});
  }

  async autoIngredients(req: Request, res: Response) {
    const { term } = req.query;
    assert(term, validSearchTerm);
    const repo = new IngredientRepo();
    const found = await repo.autosuggest(term);
    return res.json({found});
  }

  /*async autoProducts(req: Request, res: Response) {
    const { term } = req.query;
    assert(term, validSearchTerm);
    const repo = new ProductRepo();
    const found = await repo.autosuggest(term);
    return res.json({found});
  }*/

  async autoRecipes(req: Request, res: Response) {
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

  /*async searchProducts(req: Request, res: Response) {
    const { term, filters, sorts, currentPage, resultsPerPage } = req.query;
    const searchRequest = create({term, filters, sorts, currentPage, resultsPerPage}, validSearchRequest);
    const repo = new ProductRepo();
    const found = await repo.search(searchRequest);
    return res.json({found});
  }*/

  async searchRecipes(req: Request, res: Response) {
    const { term, filters, sorts, currentPage, resultsPerPage } = req.query;
    const searchRequest = create({term, filters, sorts, currentPage, resultsPerPage}, validSearchRequest);
    const repo = new RecipeRepo();
    const found = await repo.search(searchRequest);
    return res.json({found});
  }
}
