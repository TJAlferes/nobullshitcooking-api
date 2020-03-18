const pool = require('../lib/connections/mysqlPoolConnection');
const Recipe = require('../mysql-access/Recipe');
const validRecipeRequest = require('../lib/validations/recipe/recipeRequest');

const recipeController = {
  viewAllOfficialRecipes: async function(req, res) {  // why exactly is this needed? planner?
    const authorId = 1;
    const ownerId = 1;
    const recipe = new Recipe(pool);
    const rows = await recipe.viewRecipes(authorId, ownerId);
    res.send(rows);
  },
  viewRecipeDetail: async function(req, res) {
    const recipeId = Number(req.sanitize(req.params.recipeId));
    const authorId = 1;
    const ownerId = 1;
    validRecipeRequest({recipeId});
    const recipe = new Recipe(pool);
    const recipeDetail = await recipe.viewRecipeById(recipeId, authorId, ownerId);
    res.send(recipeDetail);
  }
};

module.exports = recipeController;