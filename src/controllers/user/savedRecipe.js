const pool = require('../../data-access/dbPoolConnection');
const SavedRecipe = require('../../data-access/SavedRecipe');

const userSavedRecipeController = {
  viewSavedRecipes: async function(req, res, next) {
    try {
      const userId = req.sanitize(req.body.userId);
      const savedRecipe = new SavedRecipe(pool);
      const rows = await savedRecipe.viewSavedRecipes(userId);
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  },
  createSavedRecipe: async function(req, res, next) {
    try {
      const userId = req.session.userInfo.userId;
      const recipeId = req.sanitize(req.body.recipeId);
      const savedRecipe = new SavedRecipe(pool);
      const [ row ] = await savedRecipe.createSavedRecipe(userId, recipeId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  deleteSavedRecipe: async function(req, res, next) {
    try {
      const userId = req.session.userInfo.userId;
      const recipeId = req.sanitize(req.body.recipeId);
      const savedRecipe = new SavedRecipe(pool);
      const [ row ] = await savedRecipe.deleteSavedRecipe(userId, recipeId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = userSavedRecipeController;