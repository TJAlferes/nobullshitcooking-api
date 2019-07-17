const pool = require('../../data-access/dbPoolConnection');
const SavedRecipe = require('../../data-access/SavedRecipe');

const userSavedRecipeController = {
  viewSavedByUser: async function(req, res, next) {
    try {
      const userId = req.body.userId;
      const savedRecipe = new SavedRecipe(pool);
      const rows = await savedRecipe.viewSavedByUser(userId);
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  },
  createSavedByUser: async function(req, res, next) {
    try {
      const userId = req.body.userId;
      const recipeId = req.body.recipeId;
      const savedRecipe = new SavedRecipe(pool);
      const [ row ] = await savedRecipe.createSavedByUser(userId, recipeId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  deleteSavedByUser: async function(req, res, next) {
    try {
      const userId = req.body.userId;
      const recipeId = req.body.recipeId;
      const savedRecipe = new SavedRecipe(pool);
      const [ row ] = await savedRecipe.deleteSavedByUser(userId, recipeId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = userSavedRecipeController;