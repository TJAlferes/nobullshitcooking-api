const pool = require('../../data-access/dbPoolConnection');
const Recipe = require('../../data-access/Recipe');
const validator = require('../../lib/validations/recipe');

const staffRecipeController = {
  createRecipe: async function(req, res) {
    try {
      const recipeInfo = req.body.recipeInfo;  // sanitize and validate
      validator.validate(recipeInfo);  // implement control flow here
      const recipe = new Recipe(pool);
      const [ row ] = await recipe.createRecipe(recipeInfo);
      res.send(row);
    } catch(err) {
      console.log(err);  // res the error, safely
    }
  },
  updateRecipe: async function(req, res) {
    try {
      const recipeInfo = req.body.recipeInfo;  // sanitize and validate
      validator.validate(recipeInfo);  // implement control flow here
      const recipe = new Recipe(pool);
      const [ row ] = await recipe.updateRecipe(recipeInfo);
      res.send(row);
    } catch(err) {
      console.log(err);  // res the error, safely
    }
  },
  deleteRecipe: async function(req, res) {
    try {
      const recipeId = req.body.recipeId;  // sanitize and validate
      const recipe = new Recipe(pool);
      const [ row ] = await recipe.deleteRecipe(recipeId);
      res.send(row);
    } catch(err) {
      console.log(err);  // res the error, safely
    }
  }
};

module.exports = staffRecipeController;