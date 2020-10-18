import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { Method } from '../access/mysql/Method';

export class MethodController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewByName = this.viewByName.bind(this);
  }

  async view(req: Request, res: Response) {
    const method = new Method(this.pool);

    const rows = await method.view();

    return res.send(rows);
  }

  async viewByName(req: Request, res: Response) {
    const { name } = req.params;

    const method = new Method(this.pool);

    const [ row ] = await method.viewByName(name);
    
    return res.send(row);
  }
}