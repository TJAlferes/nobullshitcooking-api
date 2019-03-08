const pool = require('../data-access/dbPoolConnection');  // move?
const EquipmentType = require('../data-access/EquipmentType');

// object versus class?
const equipmentTypeController = {
  viewAllEquipmentTypes: async function(req, res) {
    try {
      const equipmentType = new EquipmentType(pool);
      const [ rows ] = await equipmentType.viewAllEquipmentTypes();
      res.send(rows);
    } catch(err) {
      console.log(err);
    }
  },
  viewEquipmentTypeById: async function(req, res) {
    try {
      const typeId = req.params.id;  // sanitize and validate
      const equipmentType = new EquipmentType(pool);
      const [ rows ] = await equipmentType.viewEquipmentTypeById(typeId);
      res.send(rows);
    } catch(err) {
      console.log(err);
    }
  }
};

module.exports = equipmentTypeController;