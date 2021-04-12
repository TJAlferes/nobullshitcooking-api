import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { ContentType } from '../access/mysql';

export class ContentTypeController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewByName = this.viewByName.bind(this);
  }

  async view(req: Request, res: Response) {
    const contentType = new ContentType(this.pool);

    const rows = await contentType.view();

    return res.send(rows);
  }

  async viewByName(req: Request, res: Response) {
    const { name } = req.params;

    const contentType = new ContentType(this.pool);

    const [ row ] = await contentType.viewByName(name);
    
    return res.send(row);
  }
}