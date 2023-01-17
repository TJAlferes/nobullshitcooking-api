import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { Equipment, Ingredient, Product, Recipe } from '../access/mysql';

// "auto" is short for "autocomplete / live search suggestions"
export class SearchController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool =            pool;
    //this.autoEquipment =   this.autoEquipment.bind(this);
    //this.autoIngredients = this.autoIngredients.bind(this);
    //this.autoProducts =    this.autoProducts.bind(this);
    //this.autoRecipes =     this.autoRecipes.bind(this);
    this.searchEquipment =   this.searchEquipment.bind(this);
    this.searchIngredients = this.searchIngredients.bind(this);
    this.searchProducts =    this.searchProducts.bind(this);
    this.searchRecipes =     this.searchRecipes.bind(this);
  }

  /*async autoEquipment(req: Request, res: Response) {
    const { term } = req.body;

    const equipment = new Equipment(this.pool);
    const found = await equipment.auto(term);
    return res.json({found});
  }

  async autoIngredients(req: Request, res: Response) {
    const { term } = req.body;

    const ingredient = new Ingredient(this.pool);
    const found = await ingredient.auto(term);
    return res.json({found});
  }

  async autoProducts(req: Request, res: Response) {
    const { term } = req.body;

    const product = new Product(this.pool);
    const found = await product.auto(term);
    return res.json({found});
  }

  async autoRecipes(req: Request, res: Response) {
    const { term } = req.body;

    const recipe = new Recipe(this.pool);
    const found = await recipe.auto(term);
    return res.json({found});
  }*/

  async searchEquipment(req: Request, res: Response) {
    const { term } = req.body;  // security?

    const equipment = new Equipment(this.pool);
    const found = await equipment.search(term);
    return res.json({found});
  }

  async searchIngredients(req: Request, res: Response) {
    const { term } = req.body;  // security?

    const ingredient = new Ingredient(this.pool);
    const found = await ingredient.search(term);
    return res.json({found});
  }

  async searchProducts(req: Request, res: Response) {
    const { term } = req.body;  // security?

    const product = new Product(this.pool);
    const found = await product.search(term);
    return res.json({found});
  }

  async searchRecipes(req: Request, res: Response) {
    const { term } = req.body;  // security?

    const recipe = new Recipe(this.pool);
    const found = await recipe.search(term);
    return res.json({found});
  }
}