import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { pool } from '../lib/connections/mysqlPoolConnection';
import {
  validRecipeRequest
} from '../lib/validations/recipe/recipeRequest';
import { Recipe } from '../mysql-access/Recipe';

export const recipeController = {
  viewRecipes: async function(req: Request, res: Response) {
    const authorId = 1;
    const ownerId = 1;

    const recipe = new Recipe(pool);

    const rows = await recipe.viewRecipes(authorId, ownerId);

    return res.send(rows);
  },
  viewRecipeDetail: async function(req: Request, res: Response) {
    const recipeId = Number(req.params.recipeId);
    const authorId = 1;
    const ownerId = 1;

    assert({recipeId}, validRecipeRequest);

    const recipe = new Recipe(pool);

    // inconsistent naming... please fix...
    const [ row ] = await recipe
    .viewRecipeById(recipeId, authorId, ownerId);

    return res.send(row);
  }
};