import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { CuisineIngredient } from '../../mysql-access/CuisineIngredient';

export class StaffCuisineIngredientController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
  }
  
  async create(req: Request, res: Response) {
    const cuisineId = Number(req.body.cuisineId);
    const ingredientId = Number(req.body.ingredientId);
    const cuisineIngredient = new CuisineIngredient(this.pool);
    await cuisineIngredient.create(cuisineId, ingredientId);
    return res.send({message: 'Cuisine ingredient created.'});
  }

  async delete(req: Request, res: Response) {
    const cuisineId = Number(req.body.cuisineId);
    const ingredientId = Number(req.body.ingredientId);
    const cuisineIngredient = new CuisineIngredient(this.pool);
    await cuisineIngredient.delete(cuisineId, ingredientId);
    return res.send({message: 'Cuisine ingredient deleted.'});
  }
}