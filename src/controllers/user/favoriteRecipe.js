const pool = require('../../data-access/dbPoolConnection');
const FavoriteRecipe = require('../../data-access/FavoriteRecipe');

const userFavoriteRecipeController = {
  viewFavoritedByUser: async function(req, res, next) {
    try {
      const userId = req.body.userId;
      const favoriteRecipe = new FavoriteRecipe(pool);
      const rows = await favoriteRecipe.viewFavoritedByUser(userId);
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  },
  createFavoritedByUser: async function(req, res, next) {
    try {
      const userId = req.body.userId;
      const recipeId = req.body.recipeId;
      const favoriteRecipe = new FavoriteRecipe(pool);
      const [ row ] = await favoriteRecipe.createFavoritedByUser(userId, recipeId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  deleteFavoritedByUser: async function(req, res, next) {
    try {
      const userId = req.body.userId;
      const recipeId = req.body.recipeId;
      const favoriteRecipe = new FavoriteRecipe(pool);
      const [ row ] = await favoriteRecipe.deleteFavoritedByUser(userId, recipeId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = userFavoriteRecipeController;