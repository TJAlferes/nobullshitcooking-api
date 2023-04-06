import { Request, Response } from 'express';
import { Pool }              from 'mysql2/promise';

import { Cuisine } from '../access/mysql';

export class CuisineController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async viewAll(req: Request, res: Response) {
    const cuisine = new Cuisine(this.pool);
    const rows = await cuisine.viewAll();
    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    const id = Number(req.params.id);
    
    const cuisine = new Cuisine(this.pool);
    const [ row ] = await cuisine.viewOne(id);
    return res.send(row);
  }
}
