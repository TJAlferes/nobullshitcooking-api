const pool = require('../../data-access/dbPoolConnection');
const Equipment = require('../../data-access/Equipment');
const validEquipmentEntity = require('../../lib/validations/staff/equipmentEntity');

const staffEquipmentController = {
  createEquipment: async function(req, res, next) {
    try {
      const equipmentTypeId = req.sanitize(req.body.equipmentInfo.equipmentTypeId);
      const equipmentName = req.sanitize(req.body.equipmentInfo.equipmentName);
      const equipmentDescription = req.sanitize(req.body.equipmentInfo.equipmentDescription);
      const equipmentImage = req.sanitize(req.body.equipmentInfo.equipmentImage);

      const equipment = new Equipment(pool);

      const equipmentToCreate = validEquipmentEntity({
        equipmentTypeId,
        equipmentName,
        equipmentDescription,
        equipmentImage
      });
      const [ row ] = await equipment.createEquipment(equipmentToCreate);

      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  updateEquipment: async function(req, res, next) {
    try {
      const equipmentTypeId = req.sanitize(req.body.equipmentInfo.equipmentTypeId);
      const equipmentName = req.sanitize(req.body.equipmentInfo.equipmentName);
      const equipmentDescription = req.sanitize(req.body.equipmentInfo.equipmentDescription);
      const equipmentImage = req.sanitize(req.body.equipmentInfo.equipmentImage);

      const equipment = new Equipment(pool);

      const equipmentToUpdate = validEquipmentEntity({
        equipmentTypeId,
        equipmentName,
        equipmentDescription,
        equipmentImage
      });
      const [ row ] = await equipment.updateEquipment(equipmentToUpdate);

      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  deleteEquipment: async function(req, res, next) {
    try {
      const equipmentId = req.body.equipmentId;  // sanitize and validate?
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