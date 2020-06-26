import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { IngredientType } from '../mysql-access/IngredientType';

export const ingredientTypeController = {
  viewIngredientTypes: async function(req: Request, res: Response) {
    const ingredientType = new IngredientType(pool);

    const rows = await ingredientType.viewIngredientTypes();
    
    return res.send(rows);
  },
  viewIngredientTypeById: async function(req: Request, res: Response) {
    const ingredientTypeId = Number(req.params.ingredientTypeId);

    const ingredientType = new IngredientType(pool);

    const [ row ] = await ingredientType
    .viewIngredientTypeById(ingredientTypeId);

    return res.send(row);
  }
};