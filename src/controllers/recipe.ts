import { Request, Response } from 'express';
//import { assert } from 'superstruct';

import { pool } from '../lib/connections/mysqlPoolConnection';
//import { validRecipeRequest } from '../lib/validations/recipe/recipeRequest';
import { Recipe } from '../mysql-access/Recipe';

export const recipeController = {
  view: async function(req: Request, res: Response) {
    const authorId = 1;
    const ownerId = 1;

    const recipe = new Recipe(pool);

    const rows = await recipe.view(authorId, ownerId);

    return res.send(rows);
  },
  viewById: async function(req: Request, res: Response) {
    const id = Number(req.params.id);
    const authorId = 1;
    const ownerId = 1;

    // defaulted?
    //assert({recipeId}, validRecipeRequest);

    const recipe = new Recipe(pool);
    
    const [ row ] = await recipe.viewById(id, authorId, ownerId);

    return res.send(row);
  }
};