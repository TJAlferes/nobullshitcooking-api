const pool = require('../../lib/connections/mysqlPoolConnection');
const FavoriteRecipe = require('../../mysql-access/FavoriteRecipe');

const userFavoriteRecipeController = {
  viewMyFavoriteRecipes: async function(req, res, next) {
    try {
      const userId = req.session.userInfo.userId;
      const favoriteRecipe = new FavoriteRecipe(pool);
      const rows = await favoriteRecipe.viewMyFavoriteRecipes(userId);
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  },
  createMyFavoriteRecipe: async function(req, res, next) {
    try {
      const userId = req.session.userInfo.userId;
      const recipeId = req.sanitize(req.body.recipeId);
      const favoriteRecipe = new FavoriteRecipe(pool);
      await favoriteRecipe.createMyFavoriteRecipe(userId, recipeId);
      res.send('Favorited.');
      next();
    } catch(err) {
      next(err);
    }
  },
  deleteMyFavoriteRecipe: async function(req, res, next) {
    try {
      const userId = req.session.userInfo.userId;
      const recipeId = req.sanitize(req.body.recipeId);
      const favoriteRecipe = new FavoriteRecipe(pool);
      await favoriteRecipe.deleteMyFavoriteRecipe(userId, recipeId);
      res.send('Unfavorited.');
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = userFavoriteRecipeController;