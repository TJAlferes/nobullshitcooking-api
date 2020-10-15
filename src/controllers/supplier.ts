import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { Supplier } from '../access/mysql/Supplier';

export class SupplierController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewById = this.viewById.bind(this);
  }

  async view(req: Request, res: Response) {
    const supplier = new Supplier(this.pool);
    const rows = await supplier.view();
    return res.send(rows);
  }

  async viewById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const supplier = new Supplier(this.pool);
    const [ row ] = await supplier.viewById(id);
    return res.send(row);
  }
}