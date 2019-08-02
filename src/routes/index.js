const equipmentRoutes = require('./equipment');
const equipmentTypeRoutes = require('./equipmentType');
const ingredientRoutes = require('./ingredient');
const ingredientTypeRoutes = require('./ingredientType');
const recipeRoutes = require('./recipe');
const recipeTypeRoutes = require('./recipeType');
const cuisineRoutes = require('./cuisine');
const methodRoutes = require('./method');
const measurementRoutes = require('./measurement');
const favoriteRecipeRoutes = require('./favoriteRecipe');
const staffRoutes = require('./staff/index');
const userRoutes = require('./user/index');
const signS3Images1 = require('./signS3Images1');

module.exports = {
  equipmentRoutes,
  equipmentTypeRoutes,
  ingredientRoutes,
  ingredientTypeRoutes,
  recipeRoutes,
  recipeTypeRoutes,
  cuisineRoutes,
  methodRoutes,
  measurementRoutes,
  favoriteRecipeRoutes,
  staffRoutes,
  userRoutes,
  signS3Images1
};