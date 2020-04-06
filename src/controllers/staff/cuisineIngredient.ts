import { Request, Response } from 'express';

const pool = require('../../lib/connections/mysqlPoolConnection');

const CuisineIngredient = require('../../mysql-access/CuisineIngredient');

const staffCuisineIngredientController = {
  createCuisineIngredient: async function(req: Request, res: Response) {
    const ingredientId = Number(req.body.ingredientId);

    const cuisineIngredient = new CuisineIngredient(pool);

    await cuisineIngredient.createCuisineIngredient(ingredientId);

    res.send({message: 'Cuisine ingredient created.'});
  },

  deleteCuisineIngredient: async function(req: Request, res: Response) {
    const cuisineId = Number(req.body.cuisineId);
    const ingredientId = Number(req.body.ingredientId);

    const cuisineIngredient = new CuisineIngredient(pool);

    await cuisineIngredient.deleteCuisineIngredient(cuisineId, ingredientId);

    res.send({message: 'Cuisine ingredient deleted.'});
  }
};

module.exports = staffCuisineIngredientController; 