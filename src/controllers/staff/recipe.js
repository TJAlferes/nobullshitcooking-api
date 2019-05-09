const pool = require('../../data-access/dbPoolConnection');
const Recipe = require('../../data-access/Recipe');
const validator = require('../../lib/validations/recipe');

const staffRecipeController = {
  createRecipe: async function(req, res, next) {
    try {
      const recipeInfo = req.body.recipeInfo;  // sanitize and validate
      validator.validate(recipeInfo);  // implement control flow here
      const recipe = new Recipe(pool);
      const [ row ] = await recipe.createRecipe(recipeInfo);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  updateRecipe: async function(req, res, next) {
    try {
      const recipeInfo = req.body.recipeInfo;  // sanitize and validate
      validator.validate(recipeInfo);  // implement control flow here
      const recipe = new Recipe(pool);
      const [ row ] = await recipe.updateRecipe(recipeInfo);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  deleteRecipe: async function(req, res, next) {
    try {
      const recipeId = req.body.recipeId;  // sanitize and validate
      const recipe = new Recipe(pool);
      const [ row ] = await recipe.deleteRecipe(recipeId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = staffRecipeController;