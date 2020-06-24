import { Request, Response } from 'express';

import { pool } from '../../lib/connections/mysqlPoolConnection';
import { CuisineIngredient } from '../../mysql-access/CuisineIngredient';

export const staffCuisineIngredientController = {
  createCuisineIngredient: async function(req: Request, res: Response) {
    const cuisineId = Number(req.body.cuisineId);
    const ingredientId = Number(req.body.ingredientId);

    const cuisineIngredient = new CuisineIngredient(pool);

    await cuisineIngredient.createCuisineIngredient(cuisineId, ingredientId);

    return res.send({message: 'Cuisine ingredient created.'});
  },

  deleteCuisineIngredient: async function(req: Request, res: Response) {
    const cuisineId = Number(req.body.cuisineId);
    const ingredientId = Number(req.body.ingredientId);

    const cuisineIngredient = new CuisineIngredient(pool);

    await cuisineIngredient.deleteCuisineIngredient(cuisineId, ingredientId);

    return res.send({message: 'Cuisine ingredient deleted.'});
  }
};