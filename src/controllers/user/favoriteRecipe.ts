const pool = require('../../lib/connections/mysqlPoolConnection');
const FavoriteRecipe = require('../../mysql-access/FavoriteRecipe');
const validFavoriteRecipeEntity = require('../../lib/validations/favoriteRecipe/favoriteRecipeEntity');

const userFavoriteRecipeController = {
  viewMyFavoriteRecipes: async function(req, res) {
    const userId = req.session.userInfo.userId;
    const favoriteRecipe = new FavoriteRecipe(pool);
    const rows = await favoriteRecipe.viewMyFavoriteRecipes(userId);
    res.send(rows);
  },
  createMyFavoriteRecipe: async function(req, res) {
    const userId = req.session.userInfo.userId;
    const recipeId = Number(req.body.recipeId);
    validFavoriteRecipeEntity({userId, recipeId});
    const favoriteRecipe = new FavoriteRecipe(pool);
    await favoriteRecipe.createMyFavoriteRecipe(userId, recipeId);
    res.send({message: 'Favorited.'});
  },
  deleteMyFavoriteRecipe: async function(req, res) {
    const userId = req.session.userInfo.userId;
    const recipeId = Number(req.body.recipeId);
    validFavoriteRecipeEntity({userId, recipeId});
    const favoriteRecipe = new FavoriteRecipe(pool);
    await favoriteRecipe.deleteMyFavoriteRecipe(userId, recipeId);
    res.send({message: 'Unfavorited.'});
  }
};

module.exports = userFavoriteRecipeController;