import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { RecipeType } from '../mysql-access/RecipeType';
import { validRecipeTypeRequest } from '../lib/validations/recipeType/recipeTypeRequest';

export const recipeTypeController = {
  viewAllRecipeTypes: async function(req: Request, res: Response) {
    const recipeType = new RecipeType(pool);
    const rows = await recipeType.viewAllRecipeTypes();
    res.send(rows);
  },
  viewRecipeTypeById: async function(req: Request, res: Response) {
    const recipeTypeId = Number(req.params.recipeTypeId);
    validRecipeTypeRequest({recipeTypeId});
    //if (recipeTypeId < 1 || recipeTypeId > 12) return res.send('invalid recipe type');
    const recipeType = new RecipeType(pool);
    const [ row ] = await recipeType.viewRecipeTypeById(recipeTypeId);
    res.send(row);
  }
};