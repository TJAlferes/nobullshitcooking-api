import { Request, Response } from 'express';
import { Client } from '@elastic/elasticsearch';

//import { AllSearch } from '../elasticsearch-access/AllSearch';
import { EquipmentSearch } from '../elasticsearch-access/EquipmentSearch';
import { IngredientSearch } from '../elasticsearch-access/IngredientSearch';
import { ProductSearch } from '../elasticsearch-access/ProductSearch';
import { RecipeSearch } from '../elasticsearch-access/RecipeSearch';

export class SearchController {
  esClient: Client;

  constructor(esClient: Client) {
    this.esClient = esClient;
    this.autocompletePublicEquipment = this.autocompletePublicEquipment.bind(this);
    this.findPublicEquipment = this.findPublicEquipment.bind(this);
    this.autocompletePublicIngredients = this.autocompletePublicIngredients.bind(this);
    this.findPublicIngredients = this.findPublicIngredients.bind(this);
    this.autocompletePublicRecipes = this.autocompletePublicRecipes.bind(this);
    this.findPublicRecipes = this.findPublicRecipes.bind(this);
  }

  /*async autocompletePublicAll(req: Request, res: Response) {
    const searchTerm = req.body.searchTerm;
    const allSearch = new AllSearch(this.esClient);
    const found = await allSearch.autoAll(searchTerm);
    return res.json({found});
  }*/

  /*async findPublicAll(req: Request, res: Response) {
    const body = req.body.body;  // security?
    const allSearch = new AllSearch(this.esClient);
    const found = await allSearch.findAll(body);
    return res.json({found});
  }*/

  async autocompletePublicEquipment(req: Request, res: Response) {
    const searchTerm = req.body.searchTerm;
    const equipmentSearch = new EquipmentSearch(this.esClient);
    const found = await equipmentSearch.auto(searchTerm);
    return res.json({found});
  }

  async findPublicEquipment(req: Request, res: Response) {
    const body = req.body.body;  // security?
    const equipmentSearch = new EquipmentSearch(this.esClient);
    const found = await equipmentSearch.find(body);
    return res.json({found});
  }

  async autocompletePublicIngredients(req: Request, res: Response) {
    const searchTerm = req.body.searchTerm;
    const ingredientSearch = new IngredientSearch(this.esClient);
    const found = await ingredientSearch.auto(searchTerm);
    return res.json({found});
  }

  async findPublicIngredients(req: Request, res: Response) {
    const body = req.body.body;  // security?
    const ingredientSearch = new IngredientSearch(this.esClient);
    const found = await ingredientSearch.find(body);
    return res.json({found});
  }

  async autocompletePublicProducts(req: Request, res: Response) {
    const searchTerm = req.body.searchTerm;
    const productSearch = new ProductSearch(this.esClient);
    const found = await productSearch.auto(searchTerm);
    return res.json({found});
  }

  async findPublicProducts(req: Request, res: Response) {
    const body = req.body.body;  // security?
    const productSearch = new ProductSearch(this.esClient);
    const found = await productSearch.find(body);
    return res.json({found});
  }

  async autocompletePublicRecipes(req: Request, res: Response) {
    const searchTerm = req.body.searchTerm;
    const recipeSearch = new RecipeSearch(this.esClient);
    const found = await recipeSearch.auto(searchTerm);
    return res.json({found});
  }

  async findPublicRecipes(req: Request, res: Response) {
    const body = req.body.body;  // security?
    const recipeSearch = new RecipeSearch(this.esClient);
    const found = await recipeSearch.find(body);
    return res.json({found});
  }
}