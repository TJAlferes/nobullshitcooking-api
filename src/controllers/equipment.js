const pool = require('../lib/connections/mysqlPoolConnection');
const Equipment = require('../mysql-access/Equipment');
const validEquipmentsRequest = require('../lib/validations/equipment/equipmentsRequest');
const validEquipmentRequest = require('../lib/validations/equipment/equipmentRequest');

const equipmentController = {
  viewEquipment: async function(req, res, next) {
    try {
      const types = (req.body.types) ? req.body.types : [];
      const starting = (req.body.start) ? Number(req.sanitize(req.body.start)) : 0;
      const display = 25;  // to do: allow user on FE to change this
      validEquipmentsRequest({types, starting, display});

      const equipment = new Equipment(pool);

      if (types.length > 1) {
        const placeholders = '?, '.repeat(types.length - 1) + '?';
        const rows = await equipment.viewEquipmentOfTypes(starting, display, placeholders, types);
        const rowCount = await equipment.countEquipmentOfTypes(placeholders, types);
        let total = rowCount[0].total;
        let pages = (total > display) ? Math.ceil(total / display) : 1;
        res.send({rows, pages, starting});
      }

      if (types.length == 1) {
        let typeId = `${types}`;
        const rows = await equipment.viewEquipmentOfType(starting, display, typeId);
        const rowCount = await equipment.countEquipmentOfType(typeId);
        let total = rowCount[0].total;
        let pages = (total > display) ? Math.ceil(total / display) : 1;
        res.send({rows, pages, starting});
      }

      if (types.length == 0) {
        const rows = await equipment.viewAllEquipment(starting, display);
        const rowCount = await equipment.countAllEquipment();
        let total = rowCount[0].total;
        let pages = (total > display) ? Math.ceil(total / display) : 1;
        res.send({rows, pages, starting});
      }

      next();
    } catch(err) {
      next(err);
    }
  },
  viewAllOfficialEquipment: async function (res, res) {
    const equipment = new Equipment(pool);
    const rows = await equipment.viewAllOfficialEquipment();
    res.send(rows);
  },
  viewEquipmentDetail: async function(req, res, next) {
    try {
      const equipmentId = Number(req.sanitize(req.params.equipmentId));
      validEquipmentRequest({equipmentId});
      const equipment = new Equipment(pool);
      const [ row ] = await equipment.viewEquipmentById(equipmentId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = equipmentController;