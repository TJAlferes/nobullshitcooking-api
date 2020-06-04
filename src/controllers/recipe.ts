import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import {
  validRecipeRequest
} from '../lib/validations/recipe/recipeRequest';
import { Recipe } from '../mysql-access/Recipe';

export const recipeController = {
  viewRecipes: async function(req: Request, res: Response) {
    const recipe = new Recipe(pool);

    const rows = await recipe.viewRecipes();

    res.send(rows);
  },
  viewRecipeDetail: async function(req: Request, res: Response) {
    const recipeId = Number(req.params.recipeId);

    validRecipeRequest({recipeId});

    const recipe = new Recipe(pool);

    const recipeDetail = await recipe.viewRecipeById(recipeId);

    res.send(recipeDetail);
  }
};