import { Request, Response } from 'express';

import { pool } from '../../lib/connections/mysqlPoolConnection';
import { CuisineEquipment } from '../../mysql-access/CuisineEquipment';

export const staffCuisineEquipmentController = {
  createCuisineEquipment: async function(req: Request, res: Response) {
    const cuisineId = Number(req.body.cuisineId);
    const equipmentId = Number(req.body.equipmentId);

    const cuisineEquipment = new CuisineEquipment(pool);

    await cuisineEquipment.createCuisineEquipment(cuisineId, equipmentId);

    res.send({message: 'Cuisine equipment created.'});
  },

  deleteCuisineEquipment: async function(req: Request, res: Response) {
    const cuisineId = Number(req.body.cuisineId);
    const equipmentId = Number(req.body.equipmentId);

    const cuisineEquipment = new CuisineEquipment(pool);

    await cuisineEquipment.deleteCuisineEquipment(cuisineId, equipmentId);

    res.send({message: 'Cuisine equipment deleted.'});
  }
};