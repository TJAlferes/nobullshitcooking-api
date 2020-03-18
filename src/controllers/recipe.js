const pool = require('../lib/connections/mysqlPoolConnection');
const Recipe = require('../mysql-access/Recipe');
const validRecipeRequest = require('../lib/validations/recipe/recipeRequest');

const recipeController = {
  viewAllOfficialRecipes: async function(req, res) {
    const recipe = new Recipe(pool);
    const rows = await recipe.viewAllOfficialRecipes();
    res.send(rows);
  },
  viewRecipeDetail: async function(req, res) {
    const recipeId = Number(req.sanitize(req.params.recipeId));
    validRecipeRequest({recipeId});
    const recipe = new Recipe(pool);
    const recipeDetail = await recipe.viewRecipeById(recipeId);
    res.send(recipeDetail);
  }
};

module.exports = recipeController;