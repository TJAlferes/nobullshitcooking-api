import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { Product } from '../access/mysql';

export class ProductController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewById = this.viewById.bind(this);
  }

  async view(req: Request, res: Response) {
    const product = new Product(this.pool);
    const rows = await product.view();
    return res.send(rows);
  }

  async viewById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const product = new Product(this.pool);
    const [ row ] = await product.viewById(id);
    return res.send(row);
  }
}