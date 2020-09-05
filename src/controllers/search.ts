import { Request, Response } from 'express';

//import { AllSearch } from '../elasticsearch-access/AllSearch';
import { EquipmentSearch } from '../elasticsearch-access/EquipmentSearch';
import { IngredientSearch } from '../elasticsearch-access/IngredientSearch';
import { ProductSearch } from '../elasticsearch-access/ProductSearch';
import { RecipeSearch } from '../elasticsearch-access/RecipeSearch';
import { esClient } from '../lib/connections/elasticsearchClient';

export const searchController = {
  /*autocompletePublicAll: async function(req: Request, res: Response) {
    const searchTerm = req.body.searchTerm;

    const allSearch = new AllSearch(esClient);

    const found = await allSearch.autoAll(searchTerm);

    return res.json({found});
  },
  findPublicAll: async function(req: Request, res: Response) {
    const body = req.body.body;  // security?

    const allSearch = new AllSearch(esClient);

    const found = await allSearch.findAll(body);

    return res.json({found});
  },*/
  autocompletePublicEquipment: async function(req: Request, res: Response) {
    const searchTerm = req.body.searchTerm;

    const equipmentSearch = new EquipmentSearch(esClient);

    const found = await equipmentSearch.auto(searchTerm);

    return res.json({found});
  },
  findPublicEquipment: async function(req: Request, res: Response) {
    const body = req.body.body;  // security?

    const equipmentSearch = new EquipmentSearch(esClient);

    const found = await equipmentSearch.find(body);
    
    return res.json({found});
  },
  autocompletePublicIngredients: async function(req: Request, res: Response) {
    const searchTerm = req.body.searchTerm;

    const ingredientSearch = new IngredientSearch(esClient);

    const found = await ingredientSearch.auto(searchTerm);

    return res.json({found});
  },
  findPublicIngredients: async function(req: Request, res: Response) {
    const body = req.body.body;  // security?

    const ingredientSearch = new IngredientSearch(esClient);

    const found = await ingredientSearch.find(body);

    return res.json({found});
  },
  autocompletePublicProducts: async function(req: Request, res: Response) {
    const searchTerm = req.body.searchTerm;

    const productSearch = new ProductSearch(esClient);

    const found = await productSearch.auto(searchTerm);

    return res.json({found});
  },
  findPublicProducts: async function(req: Request, res: Response) {
    const body = req.body.body;  // security?

    const productSearch = new ProductSearch(esClient);

    const found = await productSearch.find(body);

    return res.json({found});
  },
  autocompletePublicRecipes: async function(req: Request, res: Response) {
    const searchTerm = req.body.searchTerm;

    const recipeSearch = new RecipeSearch(esClient);

    const found = await recipeSearch.auto(searchTerm);

    return res.json({found});
  },
  findPublicRecipes: async function(req: Request, res: Response) {
    const body = req.body.body;  // security?

    const recipeSearch = new RecipeSearch(esClient);

    const found = await recipeSearch.find(body);

    return res.json({found});
  }
};