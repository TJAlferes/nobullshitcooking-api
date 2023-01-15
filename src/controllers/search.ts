import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { Equipment, Ingredient, Product, Recipe } from '../access/mysql';

// "auto" is short for "autocomplete / live search suggestions"
export class SearchController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool =            pool;
    this.autoEquipment =   this.autoEquipment.bind(this);
    this.autoIngredients = this.autoIngredients.bind(this);
    this.autoProducts =    this.autoProducts.bind(this);
    this.autoRecipes =     this.autoRecipes.bind(this);
    this.findEquipment =   this.findEquipment.bind(this);
    this.findIngredients = this.findIngredients.bind(this);
    this.findProducts =    this.findProducts.bind(this);
    this.findRecipes =     this.findRecipes.bind(this);
  }

  async autoEquipment(req: Request, res: Response) {
    const { searchTerm } = req.body;

    const equipment = new Equipment(this.pool);
    const found = await equipment.auto(searchTerm);
    return res.json({found});
  }

  async autoIngredients(req: Request, res: Response) {
    const { searchTerm } = req.body;

    const ingredient = new Ingredient(this.pool);
    const found = await ingredient.auto(searchTerm);
    return res.json({found});
  }

  async autoProducts(req: Request, res: Response) {
    const { searchTerm } = req.body;

    const product = new Product(this.pool);
    const found = await product.auto(searchTerm);
    return res.json({found});
  }

  async autoRecipes(req: Request, res: Response) {
    const { searchTerm } = req.body;

    const recipe = new Recipe(this.pool);
    const found = await recipe.auto(searchTerm);
    return res.json({found});
  }

  async findEquipment(req: Request, res: Response) {
    const { body } = req.body;  // security?

    const equipment = new Equipment(this.pool);
    const found = await equipment.find(body);
    return res.json({found});
  }

  async findIngredients(req: Request, res: Response) {
    const { body } = req.body;  // security?

    const ingredient = new Ingredient(this.pool);
    const found = await ingredient.find(body);
    return res.json({found});
  }

  async findProducts(req: Request, res: Response) {
    const { body } = req.body;  // security?

    const product = new Product(this.pool);
    const found = await product.find(body);
    return res.json({found});
  }

  async findRecipes(req: Request, res: Response) {
    const { body } = req.body;  // security?

    const recipe = new Recipe(this.pool);
    const found = await recipe.find(body);
    return res.json({found});
  }
}