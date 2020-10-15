import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { CuisineIngredient } from '../access/mysql/CuisineIngredient';

export class CuisineIngredientController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByCuisineId = this.viewByCuisineId.bind(this);
  }

  async viewByCuisineId(req: Request, res: Response) {
    const id = Number(req.params.id);
    const cuisineIngredient = new CuisineIngredient(this.pool);
    const rows = await cuisineIngredient.viewByCuisineId(id);
    return res.send(rows);
  }
}