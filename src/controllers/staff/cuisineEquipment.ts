import { Request, Response } from 'express';

const pool = require('../../lib/connections/mysqlPoolConnection');

const CuisineEquipment = require('../../mysql-access/CuisineEquipment');

const staffCuisineEquipmentController = {
  createCuisineEquipment: async function(req: Request, res: Response) {
    const equipmentId = Number(req.body.equipmentId);

    const cuisineEquipment = new CuisineEquipment(pool);

    await cuisineEquipment.createCuisineEquipment(equipmentId);

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

module.exports = staffCuisineEquipmentController;