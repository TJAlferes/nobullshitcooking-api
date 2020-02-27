const equipmentRoutes = require('./equipment');
const equipmentTypeRoutes = require('./equipmentType');
const ingredientRoutes = require('./ingredient');
const ingredientTypeRoutes = require('./ingredientType');
const recipeRoutes = require('./recipe');
const recipeTypeRoutes = require('./recipeType');
const cuisineRoutes = require('./cuisine');
const cuisineEquipmentRoutes = require('./cuisineEquipment');
const cuisineIngredientRoutes = require('./cuisineIngredient');
const cuisineSupplierRoutes = require('./cuisineSupplier');
const methodRoutes = require('./method');
const measurementRoutes = require('./measurement');
const favoriteRecipeRoutes = require('./favoriteRecipe');

const staffRoutes = require('./staff/index');

const userRoutes = require('./user/index');

const searchRoutes = require('./search');

module.exports = {
  equipmentRoutes,
  equipmentTypeRoutes,
  ingredientRoutes,
  ingredientTypeRoutes,
  recipeRoutes,
  recipeTypeRoutes,
  cuisineRoutes,
  cuisineEquipmentRoutes,
  cuisineIngredientRoutes,
  cuisineSupplierRoutes,
  methodRoutes,
  measurementRoutes,
  favoriteRecipeRoutes,

  staffRoutes,

  userRoutes,
  
  searchRoutes
};