import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { pool } from '../lib/connections/mysqlPoolConnection';
import {
  validRecipeTypeRequest
} from '../lib/validations/recipeType/recipeTypeRequest';
import { RecipeType } from '../mysql-access/RecipeType';

export const recipeTypeController = {
  viewRecipeTypes: async function(req: Request, res: Response) {
    const recipeType = new RecipeType(pool);

    const rows = await recipeType.viewRecipeTypes();

    return res.send(rows);
  },
  viewRecipeTypeById: async function(req: Request, res: Response) {
    const recipeTypeId = Number(req.params.recipeTypeId);

    assert({recipeTypeId}, validRecipeTypeRequest);

    const recipeType = new RecipeType(pool);

    const [ row ] = await recipeType.viewRecipeTypeById(recipeTypeId);
    
    return res.send(row);
  }
};