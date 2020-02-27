const pool = require('../../lib/connections/mysqlPoolConnection');

const CuisineSupplier = require('../../mysql-access/CuisineSupplier');

const staffCuisineSupplierController = {
  viewCuisineSuppliersByCuisineId: async function(req, res) {
    const cuisineId = Number(req.sanitize(req.body.cuisineId));

    const cuisineSupplier = new CuisineSupplier(pool);

    const suppliers = await cuisineSupplier
    .viewCuisineSuppliersByCuisineId(cuisineId);

    res.send({suppliers});
  },

  createCuisineSupplier: async function(req, res) {
    const supplierId = Number(req.sanitize(req.body.supplierId));

    const cuisineSupplier = new CuisineSupplier(pool);

    await cuisineSupplier.createCuisineSupplier(supplierId);

    res.send({message: 'Cuisine supplier created.'});
  },

  deleteCuisineSupplier: async function(req, res) {
    const cuisineId = Number(req.sanitize(req.body.cuisineId));
    const supplierId = Number(req.sanitize(req.body.supplierId));

    const cuisineSupplier = new CuisineSupplier(pool);

    await cuisineSupplier.deleteCuisineSupplier(cuisineId, supplierId);

    res.send({message: 'Cuisine supplier deleted.'});
  }
};

module.exports = staffCuisineSupplierController;