import { Request, Response } from 'express';

import { pool } from '../../lib/connections/mysqlPoolConnection';
import { CuisineSupplier } from '../../mysql-access/CuisineSupplier';

export const staffCuisineSupplierController = {
  create: async function(req: Request, res: Response) {
    const cuisineId = Number(req.body.cuisineId);
    const supplierId = Number(req.body.supplierId);

    const cuisineSupplier = new CuisineSupplier(pool);

    await cuisineSupplier.create(cuisineId, supplierId);

    return res.send({message: 'Cuisine supplier created.'});
  },
  delete: async function(req: Request, res: Response) {
    const cuisineId = Number(req.body.cuisineId);
    const supplierId = Number(req.body.supplierId);

    const cuisineSupplier = new CuisineSupplier(pool);

    await cuisineSupplier.delete(cuisineId, supplierId);

    return res.send({message: 'Cuisine supplier deleted.'});
  }
};