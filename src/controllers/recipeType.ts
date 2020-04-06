import { Request, Response } from 'express';

const pool = require('../lib/connections/mysqlPoolConnection');
const RecipeType = require('../mysql-access/RecipeType');
const validRecipeTypeRequest = require('../lib/validations/recipeType/recipeTypeRequest');

const recipeTypeController = {
  viewAllRecipeTypes: async function(req: Request, res: Response) {
    const recipeType = new RecipeType(pool);
    const rows = await recipeType.viewAllRecipeTypes();
    res.send(rows);
  },
  viewRecipeTypeById: async function(req: Request, res: Response) {
    const recipeTypeId = Number(req.sanitize(req.params.recipeTypeId));
    validRecipeTypeRequest({recipeTypeId});
    //if (recipeTypeId < 1 || recipeTypeId > 12) return res.send('invalid recipe type');
    const recipeType = new RecipeType(pool);
    const [ row ] = await recipeType.viewRecipeTypeById(recipeTypeId);
    res.send(row);
  }
};

module.exports = recipeTypeController;