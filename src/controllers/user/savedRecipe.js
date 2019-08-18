const pool = require('../../lib/connections/mysqlPoolConnection');
const SavedRecipe = require('../../mysql-access/SavedRecipe');
const validSavedRecipeEntity = require('../../lib/validations/savedRecipe/savedRecipeEntity');

const userSavedRecipeController = {
  viewMySavedRecipes: async function(req, res, next) {
    try {
      const userId = req.session.userInfo.userId;
      const savedRecipe = new SavedRecipe(pool);
      const rows = await savedRecipe.viewMySavedRecipes(userId);
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  },
  createMySavedRecipe: async function(req, res, next) {
    try {
      const userId = req.session.userInfo.userId;
      const recipeId = Number(req.sanitize(req.body.recipeId));
      validSavedRecipeEntity({userId, recipeId});
      const savedRecipe = new SavedRecipe(pool);
      await savedRecipe.createMySavedRecipe(userId, recipeId);
      res.send({message: 'Saved.'});
      next();
    } catch(err) {
      next(err);
    }
  },
  deleteMySavedRecipe: async function(req, res, next) {
    try {
      const userId = req.session.userInfo.userId;
      const recipeId = Number(req.sanitize(req.body.recipeId));
      validSavedRecipeEntity({userId, recipeId});
      const savedRecipe = new SavedRecipe(pool);
      await savedRecipe.deleteMySavedRecipe(userId, recipeId);
      res.send({message: 'Unsaved.'});
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = userSavedRecipeController;