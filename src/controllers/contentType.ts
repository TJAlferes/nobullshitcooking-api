import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { ContentType } from '../access/mysql';

export class ContentTypeController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view =     this.view.bind(this);
    this.viewById = this.viewById.bind(this);
  }

  async view(req: Request, res: Response) {
    const contentType = new ContentType(this.pool);
    const rows = await contentType.view();
    return res.send(rows);
  }

  async viewById(req: Request, res: Response) {
    const id = Number(req.params.id);
    
    const contentType = new ContentType(this.pool);
    const [ row ] = await contentType.viewById(id);
    return res.send(row);
  }
}