const equipmentRoutes = require('./equipment');
const equipmentTypeRoutes = require('./equipmentType');
const ingredientRoutes = require('./ingredient');
const ingredientTypeRoutes = require('./ingredientType');
const recipeRoutes = require('./recipe');
const recipeTypeRoutes = require('./recipeType');
const cuisineRoutes = require('./cuisine');
const measurementRoutes = require('./measurement');
const staffRoutes = require('./staff/index');
const userRoutes = require('./user/index');

module.exports = {
  equipmentRoutes,
  equipmentTypeRoutes,
  ingredientRoutes,
  ingredientTypeRoutes,
  recipeRoutes,
  recipeTypeRoutes,
  cuisineRoutes,
  measurementRoutes,
  staffRoutes,
  userRoutes
};