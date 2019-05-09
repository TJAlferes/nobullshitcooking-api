const pool = require('../../data-access/dbPoolConnection');
const Ingredient = require('../../data-access/Ingredient');
const validator = require('../../lib/validations/ingredient');

const staffIngredientController = {
  createIngredient: async function(req, res, next) {
    try {
      const ingredientInfo = req.body.ingredientInfo;  // sanitize and validate
      validator.validate(ingredientInfo);  // implement control flow here
      const ingredient = new Ingredient(pool);
      const [ row ] = await ingredient.createIngredient(ingredientInfo);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  updateIngredient: async function(req, res, next) {
    try {
      const ingredientInfo = req.body.ingredientInfo;  // sanitize and validate
      validator.validate(ingredientInfo);  // implement control flow here
      const ingredient = new Ingredient(pool);
      const [ row ] = await ingredient.createIngredient(ingredientInfo);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  deleteIngredient: async function(req, res, next) {
    try {
      const ingredientId = req.body.ingredientId;  // sanitize and validate
      const ingredient = new Ingredient(pool);
      const [ row ] = await ingredient.deleteIngredient(ingredientId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = staffIngredientController;