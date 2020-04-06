import { Request, Response } from 'express';

const pool = require('../lib/connections/mysqlPoolConnection');
const CuisineIngredient = require('../mysql-access/CuisineIngredient');

const cuisineIngredientController = {
  viewCuisineIngredientsByCuisineId: async function(req: Request, res: Response) {
    const cuisineId = Number(req.sanitize(req.params.cuisineId));

    const cuisineIngredient = new CuisineIngredient(pool);

    const ingredients = await cuisineIngredient
    .viewCuisineIngredientByCuisineId(cuisineId);

    res.send({ingredients});
  }
};

module.exports = cuisineIngredientController;