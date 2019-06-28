const pool = require('../../data-access/dbPoolConnection');
const User = require('../../data-access/user/User');
//const validator = require('../../lib/validations/equipment');

const userEquipmentController = {
  createUserEquipment: async function(req, res, next) {
    try {
      const equipmentInfo = req.body.equipmentInfo;  // sanitize and validate
      //validator.validate(equipmentInfo);  // implement control flow here
      const user = new User(pool);
      const [ row ] = await user.createUserEquipment(equipmentInfo);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  updateUserEquipment: async function(req, res, next) {
    try {
      const equipmentInfo = req.body.equipmentInfo;  // sanitize and validate
      //validator.validate(equipmentInfo);  // implement control flow here
      const user = new User(pool);
      const [ row ] = await user.updateUserEquipment(equipmentInfo);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  deleteUserEquipment: async function(req, res, next) {
    try {
      const equipmentId = req.body.equipmentId;  // sanitize and validate
      const user = new User(pool);
      const [ row ] = await user.deleteUserEquipment(equipmentId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  viewUserEquipment: async function(req, res, next) {
    try {
      // sanitize, validate
      const types = (req.body.types) ? req.body.types : [];
      const starting = (req.body.start) ? req.body.start : 0;
      const display = 25;
      const user = new User(pool);  // include user id in axios post

      if (types.length > 1) {
        const placeholders = '?, '.repeat(types.length - 1) + '?';
        const rows = await user.viewUserEquipmentOfTypes(starting, display, placeholders, types);
        const rowCount = await user.countUserEquipmentOfTypes(placeholders, types);
        let total = rowCount[0].total;
        let pages = (total > display) ? Math.ceil(total / display) : 1;
        res.send({rows, pages, starting});
      }

      if (types.length == 1) {
        let typeId = `${types}`;
        const rows = await user.viewUserEquipmentOfType(starting, display, typeId);
        const rowCount = await user.countUserEquipmentOfType(typeId);
        let total = rowCount[0].total;
        let pages = (total > display) ? Math.ceil(total / display) : 1;
        res.send({rows, pages, starting});
      }

      if (types.length == 0) {
        const [ rows ] = await user.viewAllUserEquipment(starting, display);
        const rowCount = await user.countAllUserEquipment();
        let total = rowCount[0].total;
        let pages = (total > display) ? Math.ceil(total / display) : 1;
        res.send({rows, pages, starting});
      }

      next();
    } catch(err) {
      next(err);
    }
  },
  viewUserEquipmentDetail: async function(req, res, next) {
    try {
      const equipmentId = req.params.equipmentId;  // change to post, include user id in axios post
      const user = new User(pool);
      const [ rows ] = await user.viewUserEquipmentById(equipmentId);
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  },
  viewUserEquipmentForSubmitEditForm: async function(req, res, next) {
    try {
      const user = new User(pool);  // include user id in axios post
      const rows = await user.viewUserEquipmentForSubmitEditForm();
      res.send(rows);
    } catch(err) {
      next(err);
    }
  }
};

module.exports = userEquipmentController;