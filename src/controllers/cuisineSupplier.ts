import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { CuisineSupplier } from '../access/mysql/CuisineSupplier';

export class CuisineSupplierController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByCuisine = this.viewByCuisine.bind(this);
  }

  async viewByCuisine(req: Request, res: Response) {
    const { cuisine } = req.params;

    const cuisineSupplier = new CuisineSupplier(this.pool);

    const rows = await cuisineSupplier.viewByCuisine(cuisine);
    
    return res.send(rows);
  }
}