import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { CuisineIngredient } from '../access/mysql/CuisineIngredient';

export class CuisineIngredientController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByCuisine = this.viewByCuisine.bind(this);
  }

  async viewByCuisine(req: Request, res: Response) {
    const { cuisine } = req.params;

    const cuisineIngredient = new CuisineIngredient(this.pool);

    const rows = await cuisineIngredient.viewByCuisine(cuisine);
    
    return res.send(rows);
  }
}