import { Request, Response } from 'express';
import { Pool }              from 'mysql2/promise';
import { assert, create }    from 'superstruct';

import { Equipment, Ingredient, Product, Recipe } from '../access/mysql';
import { validSearchTerm, validSearchRequest }    from '../lib/validations';

// "auto" here means "autosuggest" (live search suggestions)

export class SearchController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool =              pool;
    this.autoEquipment =     this.autoEquipment.bind(this);
    this.autoIngredients =   this.autoIngredients.bind(this);
    this.autoProducts =      this.autoProducts.bind(this);
    this.autoRecipes =       this.autoRecipes.bind(this);
    this.searchEquipment =   this.searchEquipment.bind(this);
    this.searchIngredients = this.searchIngredients.bind(this);
    this.searchProducts =    this.searchProducts.bind(this);
    this.searchRecipes =     this.searchRecipes.bind(this);
  }

  async autoEquipment(req: Request, res: Response) {
    const { term } = req.query;
    assert(term, validSearchTerm);
    const equipment = new Equipment(this.pool);
    const found = await equipment.auto(term);
    return res.json({found});
  }

  async autoIngredients(req: Request, res: Response) {
    const { term } = req.query;
    assert(term, validSearchTerm);
    const ingredient = new Ingredient(this.pool);
    const found = await ingredient.auto(term);
    return res.json({found});
  }

  async autoProducts(req: Request, res: Response) {
    const { term } = req.query;
    assert(term, validSearchTerm);
    const product = new Product(this.pool);
    const found = await product.auto(term);
    return res.json({found});
  }

  async autoRecipes(req: Request, res: Response) {
    const { term } = req.query;
    assert(term, validSearchTerm);
    const recipe = new Recipe(this.pool);
    const found = await recipe.auto(term);
    return res.json({found});
  }

  async searchEquipment(req: Request, res: Response) {
    const { term, filters, sorts, currentPage, resultsPerPage } = req.query;
    const searchRequest = create({term, filters, sorts, currentPage, resultsPerPage}, validSearchRequest);
    const equipment = new Equipment(this.pool);
    const found = await equipment.search(searchRequest);
    return res.json({found});
  }

  async searchIngredients(req: Request, res: Response) {
    const { term, filters, sorts, currentPage, resultsPerPage } = req.query;
    const searchRequest = create({term, filters, sorts, currentPage, resultsPerPage}, validSearchRequest);
    const ingredient = new Ingredient(this.pool);
    const found = await ingredient.search(searchRequest);
    return res.json({found});
  }

  async searchProducts(req: Request, res: Response) {
    const { term, filters, sorts, currentPage, resultsPerPage } = req.query;
    const searchRequest = create({term, filters, sorts, currentPage, resultsPerPage}, validSearchRequest);
    const product = new Product(this.pool);
    const found = await product.search(searchRequest);
    return res.json({found});
  }

  async searchRecipes(req: Request, res: Response) {
    const { term, filters, sorts, currentPage, resultsPerPage } = req.query;
    const searchRequest = create({term, filters, sorts, currentPage, resultsPerPage}, validSearchRequest);
    const recipe = new Recipe(this.pool);
    const found = await recipe.search(searchRequest);
    return res.json({found});
  }
}
