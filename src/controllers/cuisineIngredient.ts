import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { CuisineIngredient } from '../mysql-access/CuisineIngredient';

const cuisineIngredientController = {
  viewCuisineIngredientsByCuisineId: async function(req: Request, res: Response) {
    const cuisineId = Number(req.params.cuisineId);

    const cuisineIngredient = new CuisineIngredient(pool);

    const ingredients = await cuisineIngredient
    .viewCuisineIngredientsByCuisineId(cuisineId);

    res.send({ingredients});
  }
};

module.exports = cuisineIngredientController;