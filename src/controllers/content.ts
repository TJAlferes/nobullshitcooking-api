import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { Content } from '../mysql-access/Content';

export class ContentController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewById = this.viewById.bind(this);
    this.getLinksByContentTypeName = this.getLinksByContentTypeName.bind(this);
  }

  async view(req: Request, res: Response) {
    const authorId = 1;
    const content = new Content(this.pool);
    const rows = await content.view(authorId);
    return res.send(rows);
  }

  async viewById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const authorId = 1;
    const content = new Content(this.pool);
    const [ row ] = await content.viewById(id, authorId);
    return res.send(row);
  }

  async getLinksByContentTypeName(req: Request, res: Response) {
    const name = req.params.name;
    const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
    const content = new Content(this.pool);
    const rows = await content.getLinksByContentTypeName(capitalized);
    return res.send(rows);
  }
}