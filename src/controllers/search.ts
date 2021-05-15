import { Request, Response } from 'express';
import { Client } from '@elastic/elasticsearch';

import {
  //AllSearch,
  EquipmentSearch,
  IngredientSearch,
  ProductSearch,
  RecipeSearch
} from '../access/elasticsearch';

// Note: "auto" is short for "autocomplete / live search suggestions"

export class SearchController {
  esClient: Client;

  constructor(esClient: Client) {
    this.esClient = esClient;
    this.autoEquipment = this.autoEquipment.bind(this);
    this.findEquipment = this.findEquipment.bind(this);
    this.autoIngredients = this.autoIngredients.bind(this);
    this.findIngredients = this.findIngredients.bind(this);
    this.autoRecipes = this.autoRecipes.bind(this);
    this.findRecipes = this.findRecipes.bind(this);
  }

  /*async autoAll(req: Request, res: Response) {
    const { searchTerm } = req.body;
    const allSearch = new AllSearch(this.esClient);
    const found = await allSearch.auto(searchTerm);
    return res.json({found});
  }*/

  /*async findAll(req: Request, res: Response) {
    const { body } = req.body;  // security?
    const allSearch = new AllSearch(this.esClient);
    const found = await allSearch.find(body);
    return res.json({found});
  }*/

  async autoEquipment(req: Request, res: Response) {
    const { searchTerm } = req.body;
    const equipmentSearch = new EquipmentSearch(this.esClient);
    const found = await equipmentSearch.auto(searchTerm);
    return res.json({found});
  }

  async findEquipment(req: Request, res: Response) {
    const { body } = req.body;  // security?
    const equipmentSearch = new EquipmentSearch(this.esClient);
    const found = await equipmentSearch.find(body);
    return res.json({found});
  }

  async autoIngredients(req: Request, res: Response) {
    const { searchTerm } = req.body;
    const ingredientSearch = new IngredientSearch(this.esClient);
    const found = await ingredientSearch.auto(searchTerm);
    return res.json({found});
  }

  async findIngredients(req: Request, res: Response) {
    const { body } = req.body;  // security?
    const ingredientSearch = new IngredientSearch(this.esClient);
    const found = await ingredientSearch.find(body);
    return res.json({found});
  }

  async autoProducts(req: Request, res: Response) {
    const { searchTerm } = req.body;
    const productSearch = new ProductSearch(this.esClient);
    const found = await productSearch.auto(searchTerm);
    return res.json({found});
  }

  async findProducts(req: Request, res: Response) {
    const { body } = req.body;  // security?
    const productSearch = new ProductSearch(this.esClient);
    const found = await productSearch.find(body);
    return res.json({found});
  }

  async autoRecipes(req: Request, res: Response) {
    const { searchTerm } = req.body;
    const recipeSearch = new RecipeSearch(this.esClient);
    const found = await recipeSearch.auto(searchTerm);
    return res.json({found});
  }

  async findRecipes(req: Request, res: Response) {
    const { body } = req.body;  // security?
    const recipeSearch = new RecipeSearch(this.esClient);
    const found = await recipeSearch.find(body);
    return res.json({found});
  }
}