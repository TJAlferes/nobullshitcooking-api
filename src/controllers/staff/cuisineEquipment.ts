import { Request, Response } from 'express';

import { pool } from '../../lib/connections/mysqlPoolConnection';
import { CuisineEquipment } from '../../mysql-access/CuisineEquipment';

export const staffCuisineEquipmentController = {
  create: async function(req: Request, res: Response) {
    const cuisineId = Number(req.body.cuisineId);
    const equipmentId = Number(req.body.equipmentId);

    const cuisineEquipment = new CuisineEquipment(pool);

    await cuisineEquipment.create(cuisineId, equipmentId);

    return res.send({message: 'Cuisine equipment created.'});
  },
  delete: async function(req: Request, res: Response) {
    const cuisineId = Number(req.body.cuisineId);
    const equipmentId = Number(req.body.equipmentId);

    const cuisineEquipment = new CuisineEquipment(pool);

    await cuisineEquipment.delete(cuisineId, equipmentId);

    return res.send({message: 'Cuisine equipment deleted.'});
  }
};