const pool = require('../../data-access/dbPoolConnection');
const FavoriteRecipe = require('../../data-access/FavoriteRecipe');

const userFavoriteRecipeController = {
  viewFavoriteRecipes: async function(req, res, next) {
    try {
      const userId = req.sanitize(req.body.userId);
      const favoriteRecipe = new FavoriteRecipe(pool);
      const rows = await favoriteRecipe.viewFavoriteRecipes(userId);
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  },
  createFavoriteRecipe: async function(req, res, next) {
    try {
      const userId = req.session.userInfo.userId;
      const recipeId = req.sanitize(req.body.recipeId);
      const favoriteRecipe = new FavoriteRecipe(pool);
      const [ row ] = await favoriteRecipe.createFavoriteRecipe(userId, recipeId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  deleteFavoriteRecipe: async function(req, res, next) {
    try {
      const userId = req.session.userInfo.userId;
      const recipeId = req.sanitize(req.body.recipeId);
      const favoriteRecipe = new FavoriteRecipe(pool);
      const [ row ] = await favoriteRecipe.deleteFavoriteRecipe(userId, recipeId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = userFavoriteRecipeController;