import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { pool } from '../lib/connections/mysqlPoolConnection';
import {
  validIngredientTypeRequest
} from '../lib/validations/ingredientType/ingredientTypeRequest';
import { IngredientType } from '../mysql-access/IngredientType';

export const ingredientTypeController = {
  viewIngredientTypes: async function(req: Request, res: Response) {
    const ingredientType = new IngredientType(pool);

    const rows = await ingredientType.viewIngredientTypes();
    
    res.send(rows);
  },
  viewIngredientTypeById: async function(req: Request, res: Response) {
    const ingredientTypeId = Number(req.params.ingredientTypeId);

    assert({ingredientTypeId}, validIngredientTypeRequest);

    const ingredientType = new IngredientType(pool);

    const [ row ] = await ingredientType
    .viewIngredientTypeById(ingredientTypeId);

    res.send(row);
  }
};