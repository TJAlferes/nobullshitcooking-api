import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { CuisineEquipment } from '../mysql-access/CuisineEquipment';

const cuisineEquipmentController = {
  viewCuisineEquipmentByCuisineId: async function(req: Request, res: Response) {
    const cuisineId = Number(req.params.cuisineId);

    const cuisineEquipment = new CuisineEquipment(pool);

    const equipment = await cuisineEquipment
    .viewCuisineEquipmentByCuisineId(cuisineId);

    res.send({equipment});
  }
};

module.exports = cuisineEquipmentController;