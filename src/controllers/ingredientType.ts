import { Request, Response } from 'express';

const pool = require('../lib/connections/mysqlPoolConnection');
const IngredientType = require('../mysql-access/IngredientType');
const validIngredientTypeRequest = require('../lib/validations/ingredientType/ingredientTypeRequest');

const ingredientTypeController = {
  viewAllIngredientTypes: async function(req: Request, res: Response) {
    const ingredientType = new IngredientType(pool);
    const rows = await ingredientType.viewAllIngredientTypes();
    res.send(rows);
  },
  viewIngredientTypeById: async function(req: Request, res: Response) {
    const ingredientTypeId = Number(req.sanitize(req.params.ingredientTypeId));
    validIngredientTypeRequest({ingredientTypeId});
    //if (ingredientTypeId < 1 || ingredientTypeId > 18) return res.send('invalid ingredient type');
    const ingredientType = new IngredientType(pool);
    const [ row ] = await ingredientType.viewIngredientTypeById(ingredientTypeId);
    res.send(row);
  }
};

module.exports = ingredientTypeController;