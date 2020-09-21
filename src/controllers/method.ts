import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { Method } from '../mysql-access/Method';

export class MethodController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewById = this.viewById.bind(this);
  }

  async view(req: Request, res: Response) {
    const method = new Method(this.pool);
    const rows = await method.view();
    return res.send(rows);
  }

  async viewById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const method = new Method(this.pool);
    const [ row ] = await method.viewById(id);
    return res.send(row);
  }
}