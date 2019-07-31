const pool = require('../lib/connections/mysqlPoolConnection');
const EquipmentType = require('../mysql-access/EquipmentType');
const validEquipmentTypeRequest = require('../lib/validations/equipmentType/equipmentTypeRequest');

const equipmentTypeController = {
  viewAllEquipmentTypes: async function(req, res, next) {
    try {
      const equipmentType = new EquipmentType(pool);
      const rows = await equipmentType.viewAllEquipmentTypes();
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  },
  viewEquipmentTypeById: async function(req, res, next) {
    try {
      const equipmentTypeId = req.sanitize(req.params.equipmentTypeId);
      validEquipmentTypeRequest({equipmentTypeId});
      //if (equipmentTypeId < 1 || equipmentTypeId > 5) throw new Error('invalid equipment type');
      const equipmentType = new EquipmentType(pool);
      const [ row ] = await equipmentType.viewEquipmentTypeById(equipmentTypeId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = equipmentTypeController;