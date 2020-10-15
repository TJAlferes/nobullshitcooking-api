import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { CuisineSupplier } from '../access/mysql/CuisineSupplier';

export class CuisineSupplierController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByCuisineId = this.viewByCuisineId.bind(this);
  }

  async viewByCuisineId(req: Request, res: Response) {
    const id = Number(req.params.id);
    const cuisineSupplier = new CuisineSupplier(this.pool);
    const rows = await cuisineSupplier.viewByCuisineId(id);
    return res.send(rows);
  }
}