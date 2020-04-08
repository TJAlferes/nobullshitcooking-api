import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { CuisineSupplier } from '../mysql-access/CuisineSupplier';

const cuisineSupplierController = {
  viewCuisineSuppliersByCuisineId: async function(req: Request, res: Response) {
    const cuisineId = Number(req.params.cuisineId);

    const cuisineSupplier = new CuisineSupplier(pool);

    const suppliers = await cuisineSupplier
    .viewCuisineSuppliersByCuisineId(cuisineId);

    res.send({suppliers});
  }
};

module.exports = cuisineSupplierController;