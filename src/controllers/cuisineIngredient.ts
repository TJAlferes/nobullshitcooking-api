import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { CuisineIngredient } from '../mysql-access/CuisineIngredient';

export const cuisineIngredientController = {
  viewByCuisineId: async function(req: Request, res: Response) {
    const id = Number(req.params.id);

    const cuisineIngredient = new CuisineIngredient(pool);

    const rows = await cuisineIngredient.viewByCuisineId(id);

    return res.send(rows);
  }
};