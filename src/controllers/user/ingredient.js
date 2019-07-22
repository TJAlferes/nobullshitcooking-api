const pool = require('../../data-access/dbPoolConnection');
//const User = require('../../data-access/user/User');
const Ingredient = require('../../data-access/Ingredient');
const validIngredientEntity = require('../../utils/validations/ingredientEntity');

const userIngredientController = {
  viewAllMyPrivateUserIngredients: async function(req, res, next) {
    try {
      const ownerId = req.session.userInfo.userId;
      const ingredient = new Ingredient(pool);
      const rows = await ingredient.viewAllMyPrivateUserIngredients(ownerId);
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  },
  viewMyPrivateUserIngredient: async function(req, res, next) {
    try {
      const ingredientId = req.sanitize(req.body.ingredientId);
      const ownerId = req.session.userInfo.userId;
      const ingredient = new Ingredient(pool);
      const [ row ] = await ingredient.viewMyPrivateUserIngredient(ingredientId, ownerId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  createIngredient: async function(req, res, next) {
    try {
      const ingredientTypeId = req.sanitize(req.body.ingredientInfo.ingredientTypeId);
      const ingredientName = req.sanitize(req.body.ingredientInfo.ingredientName);
      const ingredientDescription = req.sanitize(req.body.ingredientInfo.description);
      const ingredientImage = req.sanitize(req.body.ingredientInfo.ingredientImage);
      const authorId = req.session.userInfo.userId;
      const ownerId = req.session.userInfo.userId;
      const ingredientToCreate = validIngredientEntity({
        ingredientTypeId,
        authorId,
        ownerId,
        ingredientName,
        ingredientDescription,
        ingredientImage
      });
      const ingredient = new Ingredient(pool);
      const [ row ] = await ingredient.createIngredient(ingredientToCreate);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  updateIngredient: async function(req, res, next) {
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
  deleteMyPrivateUserIngredient: async function(req, res, next) {  // for any parent PrivateUserRecipes, set NotFound placeholder
    try {
      const ingredientId = req.sanitize(req.body.ingredientId);
      const authorId = req.session.userInfo.userId;
      const ownerId = req.session.userInfo.userId;
      const ingredient = new Ingredient(pool);
      const [ row ] = await ingredient.deleteMyPrivateUserIngredient(ingredientId, authorId, ownerId);
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