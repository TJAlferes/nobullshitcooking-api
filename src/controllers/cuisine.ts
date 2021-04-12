import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { Cuisine } from '../access/mysql';

export class CuisineController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewByName = this.viewByName.bind(this);
  }

  async view(req: Request, res: Response) {
    const cuisine = new Cuisine(this.pool);

    const rows = await cuisine.view();

    return res.send(rows);
  }

  async viewByName(req: Request, res: Response) {
    const { name } = req.params;

    const cuisine = new Cuisine(this.pool);

    const [ row ] = await cuisine.viewByName(name);

    return res.send(row);
  }
}