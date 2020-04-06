import { Request, Response } from 'express';

const pool = require('../../lib/connections/mysqlPoolConnection');

const CuisineSupplier = require('../../mysql-access/CuisineSupplier');

const staffCuisineSupplierController = {
  createCuisineSupplier: async function(req: Request, res: Response) {
    const supplierId = Number(req.body.supplierId);

    const cuisineSupplier = new CuisineSupplier(pool);

    await cuisineSupplier.createCuisineSupplier(supplierId);

    res.send({message: 'Cuisine supplier created.'});
  },

  deleteCuisineSupplier: async function(req: Request, res: Response) {
    const cuisineId = Number(req.body.cuisineId);
    const supplierId = Number(req.body.supplierId);

    const cuisineSupplier = new CuisineSupplier(pool);

    await cuisineSupplier.deleteCuisineSupplier(cuisineId, supplierId);

    res.send({message: 'Cuisine supplier deleted.'});
  }
};

module.exports = staffCuisineSupplierController;