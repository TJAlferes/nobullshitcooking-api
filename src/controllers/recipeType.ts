import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { pool } from '../lib/connections/mysqlPoolConnection';
import {
  validRecipeTypeRequest
} from '../lib/validations/recipeType/recipeTypeRequest';
import { RecipeType } from '../mysql-access/RecipeType';

export const recipeTypeController = {
  view: async function(req: Request, res: Response) {
    const recipeType = new RecipeType(pool);

    const rows = await recipeType.view();

    return res.send(rows);
  },
  viewById: async function(req: Request, res: Response) {
    const id = Number(req.params.id);

    assert({id}, validRecipeTypeRequest);

    const recipeType = new RecipeType(pool);

    const [ row ] = await recipeType.viewById(id);
    
    return res.send(row);
  }
};