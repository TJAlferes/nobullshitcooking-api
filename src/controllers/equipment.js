const pool = require('../data-access/dbPoolConnection');  // move?
const Equipment = require('../data-access/Equipment');

// object versus class?
const equipmentController = {
  viewEquipment: async function(req, res) {  // split into three methods?
    try {
      // sanitize, validate
      const types = (req.body.types) ? req.body.types : [];
      const starting = (req.body.start) ? req.body.start : 0;
      const display = 25;
      const equipment = new Equipment(pool);  // pass in pool... here in controllers / business logic... or in data access logic? Also, instantiate in here?
      // query all equipment of checked equipment types (multiple filters checked on frontend UI)
      if (types.length > 1) {
        let typeIds = [];
        for (i = 0; i < types.length; i++) {
          typeIds.push(types[i]);
        };
        const placeholders = '?, '.repeat(types.length - 1) + '?';
        const [ rows ] = await equipment.viewEquipmentOfTypes(starting, display, placeholders, typeIds);
        const [ rowCount ] = await equipment.countEquipmentOfTypes(placeholders, typeIds);
        // pagination (up to 25 equipments per page) (why repeat 3 times?)
        let total = rowCount[0].total;
        let pages = (total > display) ? Math.ceil(total / display) : 1;
        let resObj = {rows, pages, starting};
        res.send(resObj);
      }
      // query all equipments of checked equipment type (one filter checked on frontend UI)
      if (types.length == 1) {
        let typeId = `${types}`;  // convert array element to string for SQL query
        const [ rows ] = await equipment.viewEquipmentOfType(starting, display, typeId);
        const [ rowCount ] = await equipment.countEquipmentOfType(typeId);
        // pagination (up to 25 equipments per page) (why repeat 3 times?)
        let total = rowCount[0].total;
        let pages = (total > display) ? Math.ceil(total / display) : 1;
        let resObj = {rows, pages, starting};
        res.send(resObj);
      }
      // query all equipments (no filtration on frontend UI)
      if (types.length == 0) {
        const [ rows ] = await equipment.viewAllEquipment(starting, display);
        const [ rowCount ] = await equipment.countAllEquipment();
        // pagination (up to 25 equipments per page) (why repeat 3 times?)
        let total = rowCount[0].total;
        let pages = (total > display) ? Math.ceil(total / display) : 1;
        let resObj = {rows, pages, starting};
        res.send(resObj);
      }
    } catch(err) {
      console.log(err);  // res the error, safely
    }
  },
  viewEquipmentDetail: async function(req, res) {
    try {
      const equipmentId = req.params.id;  // sanitize and validate
      const equipment = new Equipment(pool);  // pass in pool... here in controllers / business logic... or in data access logic? Also, instantiate in here?
      const [ rows ] = await equipment.viewEquipmentById(equipmentId);
      res.send(rows);
    } catch(err) {
      console.log(err);  // res the error, safely
    }
  },
  createEquipment: async function(req, res) {
    try {
      const equipmentInfo = req.body.equipmentInfo;  // sanitize and validate
      const equipment = new Equipment(pool);
      const [ row ] = await equipment.createEquipment(equipmentInfo);
      res.send(row);
    } catch(err) {
      console.log(err);  // res the error, safely
    }
  },
  updateEquipment: async function(req, res) {
    try {
      const equipmentInfo = req.body.equipmentInfo;  // sanitize and validate
      const equipment = new Equipment(pool);
      const [ row ] = await equipment.createEquipment(equipmentInfo);
      res.send(row);
    } catch(err) {
      console.log(err);  // res the error, safely
    }
  },
  deleteEquipment: async function(req, res) {
    try {
      const equipmentId = req.body.equipmentId;  // sanitize and validate
      const equipment = new Equipment(pool);
      const [ row ] = await equipment.deleteEquipment(equipmentId);
      res.send(row);
    } catch(err) {
      console.log(err);  // res the error, safely
    }
  }
};

module.exports = equipmentController;