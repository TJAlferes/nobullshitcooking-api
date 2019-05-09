const pool = require('../../data-access/dbPoolConnection');
const Equipment = require('../../data-access/Equipment');
const validator = require('../../lib/validations/equipment');

const staffEquipmentController = {
  createEquipment: async function(req, res, next) {
    try {
      const equipmentInfo = req.body.equipmentInfo;  // sanitize and validate
      validator.validate(equipmentInfo);  // implement control flow here
      const equipment = new Equipment(pool);
      const [ row ] = await equipment.createEquipment(equipmentInfo);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  updateEquipment: async function(req, res, next) {
    try {
      const equipmentInfo = req.body.equipmentInfo;  // sanitize and validate
      validator.validate(equipmentInfo);  // implement control flow here
      const equipment = new Equipment(pool);
      const [ row ] = await equipment.createEquipment(equipmentInfo);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  deleteEquipment: async function(req, res, next) {
    try {
      const equipmentId = req.body.equipmentId;  // sanitize and validate
      const equipment = new Equipment(pool);
      const [ row ] = await equipment.deleteEquipment(equipmentId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = staffEquipmentController;