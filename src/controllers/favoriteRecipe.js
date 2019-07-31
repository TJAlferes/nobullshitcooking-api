const pool = require('../lib/connections/mysqlPoolConnection');
const FavoriteRecipe = require('../mysql-access/FavoriteRecipe');

const favoriteRecipeController = {
  viewMostFavorited: async function(req, res, next) {
    try {
      const limit = req.body.limit;
      const favoriteRecipe = new FavoriteRecipe(pool);
      const rows = await favoriteRecipe.viewMostFavorited(limit);
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = favoriteRecipeController;