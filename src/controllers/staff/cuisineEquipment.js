const pool = require('../../lib/connections/mysqlPoolConnection');

const CuisineEquipment = require('../../mysql-access/CuisineEquipment');

const staffCuisineEquipmentController = {
  createCuisineEquipment: async function(req, res) {
    const equipmentId = Number(req.sanitize(req.body.equipmentId));

    const cuisineEquipment = new CuisineEquipment(pool);

    await cuisineEquipment.createCuisineEquipment(equipmentId);

    res.send({message: 'Cuisine equipment created.'});
  },

  deleteCuisineEquipment: async function(req, res) {
    const cuisineId = Number(req.sanitize(req.body.cuisineId));
    const equipmentId = Number(req.sanitize(req.body.equipmentId));

    const cuisineEquipment = new CuisineEquipment(pool);

    await cuisineEquipment.deleteCuisineEquipment(cuisineId, equipmentId);

    res.send({message: 'Cuisine equipment deleted.'});
  }
};

module.exports = staffCuisineEquipmentController;