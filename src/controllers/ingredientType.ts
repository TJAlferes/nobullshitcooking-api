import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { IngredientType } from '../access/mysql';

export class IngredientTypeController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool =    pool;
    this.viewAll = this.viewAll.bind(this);
    this.viewOne = this.viewOne.bind(this);
  }

  async viewAll(req: Request, res: Response) {
    const ingredientType = new IngredientType(this.pool);
    const rows = await ingredientType.viewAll();
    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    const id = Number(req.params.id);
    
    const ingredientType = new IngredientType(this.pool);
    const [ row ] = await ingredientType.viewOne(id);
    return res.send(row);
  }
}