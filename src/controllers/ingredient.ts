import { Request, Response } from 'express';

const pool = require('../lib/connections/mysqlPoolConnection');
const Ingredient = require('../mysql-access/Ingredient');
const validIngredientRequest = require('../lib/validations/ingredient/ingredientRequest');

const ingredientController = {
  viewAllOfficialIngredients: async function (req: Request, res: Response) {
    const authorId = 1;
    const ownerId = 1;
    const ingredient = new Ingredient(pool);
    const rows = await ingredient.viewAllOfficialIngredients(authorId, ownerId);
    res.send(rows);
  },
  viewIngredientDetail: async function(req: Request, res: Response) {
    const ingredientId = Number(req.sanitize(req.params.ingredientId));
    const authorId = 1;
    const ownerId = 1;
    validIngredientRequest({ingredientId});
    const ingredient = new Ingredient(pool);
    const [ row ] = await ingredient.viewIngredientById(ingredientId, authorId, ownerId);
    res.send(row);
  }
};

module.exports = ingredientController;