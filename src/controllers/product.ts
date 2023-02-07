import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { Product } from '../access/mysql';

export class ProductController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool =    pool;
    this.viewAll = this.viewAll.bind(this);
    this.viewOne = this.viewOne.bind(this);
  }

  async viewAll(req: Request, res: Response) {
    const product = new Product(this.pool);
    const rows = await product.viewAll();
    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    const id = Number(req.params.id);
    
    const product = new Product(this.pool);
    const [ row ] = await product.viewOne(id);
    return res.send(row);
  }
}