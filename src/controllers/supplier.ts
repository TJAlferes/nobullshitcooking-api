import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { Supplier } from '../access/mysql/Supplier';

export class SupplierController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewByName = this.viewByName.bind(this);
  }

  async view(req: Request, res: Response) {
    const supplier = new Supplier(this.pool);

    const rows = await supplier.view();

    return res.send(rows);
  }

  async viewByName(req: Request, res: Response) {
    const { name } = req.params;

    const supplier = new Supplier(this.pool);

    const [ row ] = await supplier.viewByName(name);
    
    return res.send(row);
  }
}