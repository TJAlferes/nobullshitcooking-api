const pool = require('../../lib/connections/mysqlPoolConnection');
const Equipment = require('../../mysql-access/Equipment');
const validEquipmentEntity = require('../../lib/validations/equipment/equipmentEntity');

const userEquipmentController = {
  viewAllMyPrivateUserEquipment: async function(req, res, next) {
    try {
      const ownerId = req.session.userInfo.userId;
      const equipment = new Equipment(pool);
      const rows = await equipment.viewAllMyPrivateUserEquipment(ownerId);
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  },
  viewMyPrivateUserEquipment: async function(req, res, next) {
    try {
      const equipmentId = req.sanitize(req.body.equipmentId);
      const ownerId = req.session.userInfo.userId;
      const equipment = new Equipment(pool);
      const [ row ] = await equipment.viewMyPrivateUserEquipment(ownerId, equipmentId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  createMyPrivateUserEquipment: async function(req, res, next) {
    try {
      const equipmentTypeId = req.sanitize(req.body.equipmentInfo.equipmentTypeId);
      const equipmentName = req.sanitize(req.body.equipmentInfo.equipmentName);
      const equipmentDescription = req.sanitize(req.body.equipmentInfo.equipmentDescription);
      const equipmentImage = req.sanitize(req.body.equipmentInfo.equipmentImage);

      const authorId = req.session.userInfo.userId;
      const ownerId = req.session.userInfo.userId;

      const equipmentToCreate = validEquipmentEntity({
        equipmentTypeId,
        authorId,
        ownerId,
        equipmentName,
        equipmentDescription,
        equipmentImage
      });
      const equipment = new Equipment(pool);
      const [ row ] = await equipment.createMyPrivateUserEquipment(equipmentToCreate);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  updateMyPrivateUserEquipment: async function(req, res, next) {
    try {
      const equipmentId = req.sanitize(req.body.equipmentInfo.equipmentId);
      const equipmentTypeId = req.sanitize(req.body.equipmentInfo.equipmentTypeId);
      const equipmentName = req.sanitize(req.body.equipmentInfo.equipmentName);
      const equipmentDescription = req.sanitize(req.body.equipmentInfo.equipmentDescription);
      const equipmentImage = req.sanitize(req.body.equipmentInfo.equipmentImage);

      const authorId = req.session.userInfo.userId;
      const ownerId = req.session.userInfo.userId;

      const equipmentToUpdateWith = validEquipmentEntity({
        equipmentTypeId,
        authorId,
        ownerId,
        equipmentName,
        equipmentDescription,
        equipmentImage
      });
      const equipment = new Equipment(pool);
      const [ row ] = await equipment.updateMyPrivateUserEquipment(equipmentToUpdateWith, equipmentId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  deleteMyPrivateUserEquipment: async function(req, res, next) {  // for any parent PrivateUserRecipes, set NotFound placeholder
    try {
      const equipmentId = req.sanitize(req.body.equipmentId);
      const ownerId = req.session.userInfo.userId;
      const equipment = new Equipment(pool);
      const [ row ] = await equipment.deleteMyPrivateUserEquipment(ownerId, equipmentId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = userEquipmentController;