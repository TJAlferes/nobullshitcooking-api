const pool = require('../data-access/dbPoolConnection');  // move?
const EquipmentType = require('../data-access/EquipmentType');

const equipmentTypeController = {
  viewAllEquipmentTypes: async function(req, res, next) {
    try {
      const equipmentType = new EquipmentType(pool);
      const [ rows ] = await equipmentType.viewAllEquipmentTypes();
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  },
  viewEquipmentTypeById: async function(req, res, next) {
    try {
      const equipmentTypeId = req.params.equipmentTypeId;
      if (equipmentTypeId < 1 || equipmentTypeId > 5) throw new Error('invalid equipment type');
      const equipmentType = new EquipmentType(pool);
      const [ rows ] = await equipmentType.viewEquipmentTypeById(equipmentTypeId);
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = equipmentTypeController;