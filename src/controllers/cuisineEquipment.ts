import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { CuisineEquipment } from '../mysql-access/CuisineEquipment';

export const cuisineEquipmentController = {
  viewByCuisineId: async function(req: Request, res: Response) {
    const id = Number(req.params.id);

    const cuisineEquipment = new CuisineEquipment(pool);

    const rows = await cuisineEquipment.viewByCuisineId(id);

    return res.send(rows);
  }
};