import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { CuisineIngredient } from '../../access/mysql/CuisineIngredient';

export class StaffCuisineIngredientController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
  }
  
  async create(req: Request, res: Response) {
    const { cuisine, ingredient } = req.body;

    const cuisineIngredient = new CuisineIngredient(this.pool);

    await cuisineIngredient.create(cuisine, ingredient);

    return res.send({message: 'Cuisine ingredient created.'});
  }

  async delete(req: Request, res: Response) {
    const { cuisine, ingredient } = req.body;

    const cuisineIngredient = new CuisineIngredient(this.pool);

    await cuisineIngredient.delete(cuisine, ingredient);
    
    return res.send({message: 'Cuisine ingredient deleted.'});
  }
}