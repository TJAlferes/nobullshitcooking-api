const pool = require('../../lib/connections/mysqlPoolConnection');
const RecipeIngredient = require('../../mysql-access/RecipeIngredient');
const Ingredient = require('../../mysql-access/Ingredient');
const validIngredientEntity = require('../../lib/validations/ingredient/ingredientEntity');

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
      const [ row ] = await ingredient.viewMyPrivateUserIngredient(ownerId, ingredientId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  createMyPrivateUserIngredient: async function(req, res, next) {
    try {
      const ingredientTypeId = Number(req.sanitize(req.body.ingredientInfo.ingredientTypeId));
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
      await ingredient.createMyPrivateUserIngredient(ingredientToCreate);
      res.send({message: 'Ingredient created'});
      next();
    } catch(err) {
      next(err);
    }
  },
  updateMyPrivateUserIngredient: async function(req, res, next) {
    try {
      const ingredientId = req.sanitize(req.body.ingredientInfo.ingredientId);
      const ingredientTypeId = Number(req.sanitize(req.body.ingredientInfo.ingredientTypeId));
      const ingredientName = req.sanitize(req.body.ingredientInfo.ingredientName);
      const ingredientDescription = req.sanitize(req.body.ingredientInfo.description);
      const ingredientImage = req.sanitize(req.body.ingredientInfo.ingredientImage);

      const authorId = req.session.userInfo.userId;
      const ownerId = req.session.userInfo.userId;

      const ingredientToUpdateWith = validIngredientEntity({
        ingredientTypeId,
        authorId,
        ownerId,
        ingredientName,
        ingredientDescription,
        ingredientImage
      });
      const ingredient = new Ingredient(pool);
      await ingredient.updateMyPrivateUserIngredient(ingredientToUpdateWith, ingredientId);
      res.send({message: 'Ingredient updated'});
      next();
    } catch(err) {
      next(err);
    }
  },
  deleteMyPrivateUserIngredient: async function(req, res, next) {
    try {
      const ingredientId = req.sanitize(req.body.ingredientId);
      const ownerId = req.session.userInfo.userId;
      const recipeIngredient = new RecipeIngredient(pool);
      const ingredient = new Ingredient(pool);
      await recipeIngredient.deleteRecipeIngredientsByIngredientId(ingredientId);
      await ingredient.deleteMyPrivateUserIngredient(ownerId, ingredientId);
      res.send({message: 'Ingredient deleted'});
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = userIngredientController;