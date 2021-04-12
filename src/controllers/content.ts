import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { Content } from '../access/mysql';

export class ContentController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewById = this.viewById.bind(this);
    this.getLinksByType = this.getLinksByType.bind(this);
  }

  async view(req: Request, res: Response) {
    const author = "NOBSC";

    const content = new Content(this.pool);

    const rows = await content.view(author);

    return res.send(rows);
  }

  async viewById(req: Request, res: Response) {
    const { id }  = req.params;
    const author = "NOBSC";

    const content = new Content(this.pool);

    const [ row ] = await content.viewById(id, author);

    return res.send(row);
  }

  async getLinksByType(req: Request, res: Response) {
    const { name } = req.params;

    const capitalized = name.charAt(0).toUpperCase() + name.slice(1);

    const content = new Content(this.pool);

    const rows = await content.getLinksByType(capitalized);
    
    return res.send(rows);
  }
}