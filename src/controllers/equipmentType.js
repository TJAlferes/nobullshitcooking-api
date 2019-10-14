const pool = require('../lib/connections/mysqlPoolConnection');
const EquipmentType = require('../mysql-access/EquipmentType');
const validEquipmentTypeRequest = require('../lib/validations/equipmentType/equipmentTypeRequest');

const equipmentTypeController = {
  viewAllEquipmentTypes: async function(req, res) {
    const equipmentType = new EquipmentType(pool);
    const rows = await equipmentType.viewAllEquipmentTypes();
    res.send(rows);
  },
  viewEquipmentTypeById: async function(req, res) {
    const equipmentTypeId = Number(req.sanitize(req.params.equipmentTypeId));
    validEquipmentTypeRequest({equipmentTypeId});
    //if (equipmentTypeId < 1 || equipmentTypeId > 5) throw new Error('invalid equipment type');
    const equipmentType = new EquipmentType(pool);
    const [ row ] = await equipmentType.viewEquipmentTypeById(equipmentTypeId);
    res.send(row);
  }
};

module.exports = equipmentTypeController;