import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { IngredientType } from '../mysql-access/IngredientType';
import { validIngredientTypeRequest } from '../lib/validations/ingredientType/ingredientTypeRequest';

export const ingredientTypeController = {
  viewAllIngredientTypes: async function(req: Request, res: Response) {
    const ingredientType = new IngredientType(pool);
    const rows = await ingredientType.viewAllIngredientTypes();
    res.send(rows);
  },
  viewIngredientTypeById: async function(req: Request, res: Response) {
    const ingredientTypeId = Number(req.params.ingredientTypeId);
    validIngredientTypeRequest({ingredientTypeId});
    //if (ingredientTypeId < 1 || ingredientTypeId > 18) return res.send('invalid ingredient type');
    const ingredientType = new IngredientType(pool);
    const [ row ] = await ingredientType.viewIngredientTypeById(ingredientTypeId);
    res.send(row);
  }
};