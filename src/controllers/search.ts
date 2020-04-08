import { Request, Response } from 'express';

import { esClient } from '../lib/connections/elasticsearchClient';
import { AllSearch } from '../elasticsearch-access/AllSearch';
import { RecipeSearch } from '../elasticsearch-access/RecipeSearch';
import { IngredientSearch } from '../elasticsearch-access/IngredientSearch';
import { EquipmentSearch } from '../elasticsearch-access/EquipmentSearch';

export const searchController = {
  autocompletePublicAll: async function(req: Request, res: Response) {
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
  },

  autocompletePublicRecipes: async function(req: Request, res: Response) {
    const searchTerm = req.body.searchTerm;
    const recipeSearch = new RecipeSearch(esClient);
    const found = await recipeSearch.autoRecipes(searchTerm);
    return res.json({found});
  },
  findPublicRecipes: async function(req: Request, res: Response) {
    const body = req.body.body;  // security?
    const recipeSearch = new RecipeSearch(esClient);
    const found = await recipeSearch.findRecipes(body);
    return res.json({found});
  },

  autocompletePublicIngredients: async function(req: Request, res: Response) {
    const searchTerm = req.body.searchTerm;
    const ingredientSearch = new IngredientSearch(esClient);
    const found = await ingredientSearch.autoIngredients(searchTerm);
    return res.json({found});
  },
  findPublicIngredients: async function(req: Request, res: Response) {
    const body = req.body.body;  // security?
    const ingredientSearch = new IngredientSearch(esClient);
    const found = await ingredientSearch.findIngredients(body);
    return res.json({found});
  },

  autocompletePublicEquipment: async function(req: Request, res: Response) {
    const searchTerm = req.body.searchTerm;
    const equipmentSearch = new EquipmentSearch(esClient);
    const found = await equipmentSearch.autoEquipment(searchTerm);
    return res.json({found});
  },
  findPublicEquipment: async function(req: Request, res: Response) {
    const body = req.body.body;  // security?
    const equipmentSearch = new EquipmentSearch(esClient);
    const found = await equipmentSearch.findEquipment(body);
    return res.json({found});
  }
};