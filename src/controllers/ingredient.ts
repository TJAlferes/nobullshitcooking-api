import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import {
  validIngredientRequest
} from '../lib/validations/ingredient/ingredientRequest';
import { Ingredient } from '../mysql-access/Ingredient';

export const ingredientController = {
  viewIngredients: async function (req: Request, res: Response) {
    const ingredient = new Ingredient(pool);

    const rows = await ingredient.viewIngredients();

    res.send(rows);
  },
  viewIngredientById: async function(req: Request, res: Response) {
    const ingredientId = Number(req.params.ingredientId);

    validIngredientRequest({ingredientId});

    const ingredient = new Ingredient(pool);

    const [ row ] = await ingredient.viewIngredientById(ingredientId);

    res.send(row);
  }
};