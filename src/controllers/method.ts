import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { Method } from '../access/mysql';

export class MethodController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool =    pool;
    this.viewAll = this.viewAll.bind(this);
    this.viewOne = this.viewOne.bind(this);
  }

  async viewAll(req: Request, res: Response) {
    const method = new Method(this.pool);
    const rows = await method.viewAll();
    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    const id = Number(req.params.id);

    const method = new Method(this.pool);
    const [ row ] = await method.viewOne(id);
    return res.send(row);
  }
}