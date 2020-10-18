import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { CuisineSupplier } from '../../access/mysql/CuisineSupplier';

export class StaffCuisineSupplierController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
  }
  
  async create(req: Request, res: Response) {
    const { cuisine, supplier } = req.body;

    const cuisineSupplier = new CuisineSupplier(this.pool);

    await cuisineSupplier.create(cuisine, supplier);

    return res.send({message: 'Cuisine supplier created.'});
  }

  async delete(req: Request, res: Response) {
    const { cuisine, supplier } = req.body;

    const cuisineSupplier = new CuisineSupplier(this.pool);

    await cuisineSupplier.delete(cuisine, supplier);
    
    return res.send({message: 'Cuisine supplier deleted.'});
  }
}