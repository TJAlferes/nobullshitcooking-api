import { Request, Response } from 'express';

const pool = require('../lib/connections/mysqlPoolConnection');
const CuisineEquipment = require('../mysql-access/CuisineEquipment');

const cuisineEquipmentController = {
  viewCuisineEquipmentByCuisineId: async function(req: Request, res: Response) {
    const cuisineId = Number(req.sanitize(req.params.cuisineId));

    const cuisineEquipment = new CuisineEquipment(pool);

    const equipment = await cuisineEquipment
    .viewCuisineEquipmentByCuisineId(cuisineId);

    res.send({equipment});
  }
};

module.exports = cuisineEquipmentController;