import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { IngredientType } from '../mysql-access/IngredientType';

export const ingredientTypeController = {
  view: async function(req: Request, res: Response) {
    const ingredientType = new IngredientType(pool);

    const rows = await ingredientType.view();
    
    return res.send(rows);
  },
  viewById: async function(req: Request, res: Response) {
    const id = Number(req.params.id);

    const ingredientType = new IngredientType(pool);

    const [ row ] = await ingredientType.viewById(id);

    return res.send(row);
  }
};