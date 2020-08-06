import { Request, Response } from 'express';

import { pool } from '../../lib/connections/mysqlPoolConnection';
import { CuisineIngredient } from '../../mysql-access/CuisineIngredient';

export const staffCuisineIngredientController = {
  create: async function(req: Request, res: Response) {
    const cuisineId = Number(req.body.cuisineId);
    const ingredientId = Number(req.body.ingredientId);

    const cuisineIngredient = new CuisineIngredient(pool);

    await cuisineIngredient.create(cuisineId, ingredientId);

    return res.send({message: 'Cuisine ingredient created.'});
  },
  delete: async function(req: Request, res: Response) {
    const cuisineId = Number(req.body.cuisineId);
    const ingredientId = Number(req.body.ingredientId);

    const cuisineIngredient = new CuisineIngredient(pool);

    await cuisineIngredient.delete(cuisineId, ingredientId);

    return res.send({message: 'Cuisine ingredient deleted.'});
  }
};