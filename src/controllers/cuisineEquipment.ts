const pool = require('../lib/connections/mysqlPoolConnection');
const CuisineEquipment = require('../mysql-access/CuisineEquipment');

const cuisineEquipmentController = {
  viewCuisineEquipmentByCuisineId: async function(req, res) {
    const cuisineId = Number(req.sanitize(req.params.cuisineId));

    const cuisineEquipment = new CuisineEquipment(pool);

    const equipment = await cuisineEquipment
    .viewCuisineEquipmentByCuisineId(cuisineId);

    res.send({equipment});
  }
};

module.exports = cuisineEquipmentController;