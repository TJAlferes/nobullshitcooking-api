const pool = require('../lib/connections/mysqlPoolConnection');
const FavoriteRecipe = require('../mysql-access/FavoriteRecipe');

const favoriteRecipeController = {
  viewMostFavorited: async function(req, res) {
    const limit = req.body.limit;  // no. change.
    const favoriteRecipe = new FavoriteRecipe(pool);
    const rows = await favoriteRecipe.viewMostFavorited(limit);
    res.send(rows);
  }
};

module.exports = favoriteRecipeController;