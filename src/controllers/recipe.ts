import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { Recipe } from '../mysql-access/Recipe';
import { validRecipeRequest } from '../lib/validations/recipe/recipeRequest';

export const recipeController = {
  viewAllOfficialRecipes: async function(req: Request, res: Response) {
    const authorId = 1;
    const ownerId = 1;
    const recipe = new Recipe(pool);
    const rows = await recipe.viewRecipes(authorId, ownerId);
    res.send(rows);
  },
  viewRecipeDetail: async function(req: Request, res: Response) {
    const recipeId = Number(req.params.recipeId);
    const authorId = 1;
    const ownerId = 1;
    validRecipeRequest({recipeId});
    const recipe = new Recipe(pool);
    const recipeDetail = await recipe.viewRecipeById(recipeId, authorId, ownerId);
    res.send(recipeDetail);
  }
};