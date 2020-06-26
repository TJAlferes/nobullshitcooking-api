import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { Ingredient } from '../mysql-access/Ingredient';

export const ingredientController = {
  viewIngredients: async function (req: Request, res: Response) {
    const authorId = 1;
    const ownerId = 1;

    const ingredient = new Ingredient(pool);

    const rows = await ingredient.viewIngredients(authorId, ownerId);

    return res.send(rows);
  },
  viewIngredientById: async function(req: Request, res: Response) {
    const ingredientId = Number(req.params.ingredientId);
    const authorId = 1;
    const ownerId = 1;

    const ingredient = new Ingredient(pool);

    const [ row ] = await ingredient
    .viewIngredientById(ingredientId, authorId, ownerId);

    return res.send(row);
  }
};