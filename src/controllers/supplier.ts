import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { Supplier } from '../access/mysql';

export class SupplierController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool =    pool;
    this.viewAll = this.viewAll.bind(this);
    this.viewOne = this.viewOne.bind(this);
  }

  async viewAll(req: Request, res: Response) {
    const supplier = new Supplier(this.pool);
    const rows = await supplier.viewAll();
    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    const id = Number(req.params.id);
    
    const supplier = new Supplier(this.pool);
    const [ row ] = await supplier.viewOne(id);
    return res.send(row);
  }
}