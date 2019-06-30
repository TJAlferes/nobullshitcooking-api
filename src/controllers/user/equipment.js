const uuidv4 = require('uuid/v4');

const pool = require('../../data-access/dbPoolConnection');
const xdevpool = require('../../data-access/xdevPoolConnection');
const User = require('../../data-access/user/User');
const UserEquipment = require('../../data-access/user/UserEquipment');
const validEquipmentEntity = require('../../utils/validations/user/equipmentEntity');

const userEquipmentController = {
  createUserEquipment: async function(req, res, next) {
    try {
      const equipmentTypeId = req.sanitize(req.body.equipmentInfo.equipmentTypeId);
      const equipmentName = req.sanitize(req.body.equipmentInfo.equipmentName);
      const equipmentDescription = req.sanitize(req.body.equipmentInfo.equipmentDescription);
      const equipmentImage = req.sanitize(req.body.equipmentInfo.equipmentImage);

      const equipmentId = uuidv4();

      const userId = req.session.userInfo.userId;

      const user = new User(pool);

      const equipmentToCreate = validEquipmentEntity({
        equipmentTypeId,
        equipmentName,
        equipmentDescription,
        equipmentImage
      });
      const [ row ] = await user.createUserEquipment(equipmentToCreate, equipmentId, userId);

      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  updateUserEquipment: async function(req, res, next) {
    try {
      const equipmentTypeId = req.sanitize(req.body.equipmentInfo.equipmentTypeId);
      const equipmentName = req.sanitize(req.body.equipmentInfo.equipmentName);
      const equipmentDescription = req.sanitize(req.body.equipmentInfo.equipmentDescription);
      const equipmentImage = req.sanitize(req.body.equipmentInfo.equipmentImage);

      const equipmentId = req.sanitize(req.body.equipmentInfo.equipmentId);

      const userId = req.session.userInfo.userId;

      const user = new User(pool);

      const equipmentToUpdate = validEquipmentEntity({
        equipmentTypeId,
        equipmentName,
        equipmentDescription,
        equipmentImage
      });
      const [ row ] = await user.updateUserEquipment(equipmentToUpdate, equipmentId, userId);

      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  deleteUserEquipment: async function(req, res, next) {
    try {
      const equipmentId = req.sanitize(req.body.equipmentId);
      const userId = req.session.userInfo.userId;
      const user = new User(pool);
      const [ row ] = await user.deleteUserEquipment(equipmentId, userId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  viewUserEquipment: async function(req, res, next) {
    try {
      const userId = req.session.userInfo.userId;
      const user = new User(pool);
      const rows = await user.viewUserEquipment(userId);
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  },
  viewUserEquipmentDetail: async function(req, res, next) {
    try {
      const equipmentId = req.sanitize(req.params.equipmentId);
      const userId = req.session.userInfo.userId;
      const user = new User(pool);
      const [ rows ] = await user.viewUserEquipmentById(equipmentId, userId);
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  },
  viewUserEquipmentForSubmitEditForm: async function(req, res, next) {
    try {
      const userId = req.session.userInfo.userId;
      const user = new User(pool);
      const rows = await user.viewUserEquipmentForSubmitEditForm(userId);
      res.send(rows);
    } catch(err) {
      next(err);
    }
  }
};

module.exports = userEquipmentController;