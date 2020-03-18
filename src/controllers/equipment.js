const pool = require('../lib/connections/mysqlPoolConnection');
const Equipment = require('../mysql-access/Equipment');
const validEquipmentRequest = require('../lib/validations/equipment/equipmentRequest');

const equipmentController = {
  viewAllOfficialEquipment: async function (req, res) {
    const equipment = new Equipment(pool);
    const rows = await equipment.viewAllOfficialEquipment();
    res.send(rows);
  },
  viewEquipmentDetail: async function(req, res) {
    const equipmentId = Number(req.sanitize(req.params.equipmentId));
    validEquipmentRequest({equipmentId});
    const equipment = new Equipment(pool);
    const [ row ] = await equipment.viewEquipmentById(equipmentId);
    res.send(row);
  }
};

module.exports = equipmentController;