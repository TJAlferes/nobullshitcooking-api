import { Request, Response } from 'express';
import { Pool }              from 'mysql2/promise';

import { MethodRepository } from '../access/mysql';

export class MethodController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async viewAll(req: Request, res: Response) {
    const repo = new MethodRepository(this.pool);
    const rows = await repo.viewAll();
    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    const id = Number(req.params.id);

    const repo = new MethodRepository(this.pool);
    const [ row ] = await repo.viewOne(id);
    return res.send(row);
  }
}
