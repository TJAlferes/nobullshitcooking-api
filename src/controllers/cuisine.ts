import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { Cuisine } from '../access/mysql';

export class CuisineController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewById = this.viewById.bind(this);
  }

  async view(req: Request, res: Response) {
    const cuisine = new Cuisine(this.pool);
    const rows = await cuisine.view();
    return res.send(rows);
  }

  async viewById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const cuisine = new Cuisine(this.pool);
    const [ row ] = await cuisine.viewById(id);
    return res.send(row);
  }
}