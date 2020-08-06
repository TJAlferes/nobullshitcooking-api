import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { CuisineSupplier } from '../mysql-access/CuisineSupplier';

export const cuisineSupplierController = {
  viewByCuisineId: async function(req: Request, res: Response) {
    const id = Number(req.params.id);

    const cuisineSupplier = new CuisineSupplier(pool);

    const rows = await cuisineSupplier.viewByCuisineId(id);

    return res.send(rows);
  }
};