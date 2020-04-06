import { Request, Response } from 'express';

const pool = require('../lib/connections/mysqlPoolConnection');
const CuisineSupplier = require('../mysql-access/CuisineSupplier');

const cuisineSupplierController = {
  viewCuisineSuppliersByCuisineId: async function(req: Request, res: Response) {
    const cuisineId = Number(req.sanitize(req.params.cuisineId));

    const cuisineSupplier = new CuisineSupplier(pool);

    const suppliers = await cuisineSupplier
    .viewCuisineSupplierByCuisineId(cuisineId);

    res.send({suppliers});
  }
};

module.exports = cuisineSupplierController;