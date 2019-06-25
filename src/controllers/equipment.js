const pool = require('../data-access/dbPoolConnection');  // move?
const Equipment = require('../data-access/Equipment');
const validEquipmentsRequest = require('../lib/validations/EquipmentsRequest');
const validEquipmentRequest = require('../lib/validations/EquipmentRequest');

const equipmentController = {
  viewEquipment: async function(req, res, next) {
    try {
      const types = (req.body.types) ? req.sanitize(req.body.types) : [];
      const starting = (req.body.start) ? req.sanitize(req.body.start) : 0;
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
        const [ rows ] = await equipment.viewAllEquipment(starting, display);
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
  viewEquipmentDetail: async function(req, res, next) {
    try {
      const equipmentId = req.sanitize(req.params.equipmentId);
      validEquipmentRequest({equipmentId});
      const equipment = new Equipment(pool);
      const [ rows ] = await equipment.viewEquipmentById(equipmentId);
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  },
  viewEquipmentForSubmitEditForm: async function(req, res, next) {
    try {
      const equipment = new Equipment(pool);
      const rows = await equipment.viewEquipmentForSubmitEditForm();
      res.send(rows);
    } catch(err) {
      next(err);
    }
  }
};

module.exports = equipmentController;