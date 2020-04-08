import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { Ingredient } from '../mysql-access/Ingredient';
import { validIngredientRequest } from '../lib/validations/ingredient/ingredientRequest';

export const ingredientController = {
  viewAllOfficialIngredients: async function (req: Request, res: Response) {
    const authorId = 1;
    const ownerId = 1;
    const ingredient = new Ingredient(pool);
    const rows = await ingredient.viewAllOfficialIngredients(authorId, ownerId);
    res.send(rows);
  },
  viewIngredientDetail: async function(req: Request, res: Response) {
    const ingredientId = Number(req.params.ingredientId);
    const authorId = 1;
    const ownerId = 1;
    validIngredientRequest({ingredientId});
    const ingredient = new Ingredient(pool);
    const [ row ] = await ingredient.viewIngredientById(ingredientId, authorId, ownerId);
    res.send(row);
  }
};