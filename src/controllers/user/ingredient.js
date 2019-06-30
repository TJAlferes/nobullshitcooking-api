const uuidv4 = require('uuid/v4');

const pool = require('../../data-access/dbPoolConnection');
const User = require('../../data-access/user/User');
const validIngredientEntity = require('../../utils/validations/user/ingredientEntity');

const userIngredientController = {
  createUserIngredient: async function(req, res, next) {
    try {
      const ingredientTypeId = req.sanitize(req.body.ingredientInfo.ingredientTypeId);
      const ingredientName = req.sanitize(req.body.ingredientInfo.ingredientName);
      const ingredientDescription = req.sanitize(req.body.ingredientInfo.description);
      const ingredientImage = req.sanitize(req.body.ingredientInfo.ingredientImage);

      const ingredientId = uuidv4();

      const userId = req.session.userInfo.userId;

      const user = new User(pool);

      const ingredientToCreate = validIngredientEntity({
        ingredientTypeId,
        ingredientName,
        ingredientDescription,
        ingredientImage
      });
      const [ row ] = await user.createUserIngredient(ingredientToCreate, ingredientId, userId);

      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  updateUserIngredient: async function(req, res, next) {
    try {
      const ingredientTypeId = req.sanitize(req.body.ingredientInfo.ingredientTypeId);
      const ingredientName = req.sanitize(req.body.ingredientInfo.ingredientName);
      const ingredientDescription = req.sanitize(req.body.ingredientInfo.description);
      const ingredientImage = req.sanitize(req.body.ingredientInfo.ingredientImage);

      const ingredientId = req.sanitize(req.body.ingredientInfo.ingredientId);

      const userId = req.session.userInfo.userId;

      const user = new User(pool);

      const ingredientToUpdate = validIngredientEntity({
        ingredientTypeId,
        ingredientName,
        ingredientDescription,
        ingredientImage
      });
      const [ row ] = await user.updateUserIngredient(ingredientToUpdate, ingredientId, userId);

      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  deleteUserIngredient: async function(req, res, next) {
    try {
      const ingredientId = req.sanitize(req.body.ingredientId);
      const userId = req.session.userInfo.userId;
      const user = new User(pool);
      const [ row ] = await user.deleteUserIngredient(ingredientId, userId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  viewUserIngredient: async function(req, res, next) {
    try {
      const userId = req.session.userInfo.userId;
      const user = new User(pool);
      const rows = await user.viewAllUserEquipment(userId);
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  },
  viewUserIngredientDetail: async function(req, res, next) {
    try {
      const ingredientId = req.sanitize(req.params.ingredientId);
      const user = new User(pool);
      const [ row ] = await user.viewUserIngredientById(ingredientId, userId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  viewUserEquipmentForSubmitEditForm: async function(req, res, next) {
    try {
      const userId = req.session.userInfo.userId;
      const user = new User(pool);
      const rows = await user.viewUserIngredientForSubmitEditForm(userId);
      res.send(rows);
    } catch(err) {
      next(err);
    }
  }
};

module.exports = userIngredientController;