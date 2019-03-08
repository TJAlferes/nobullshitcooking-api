const equipmentRoutes = require('./equipment');
const ingredientRoutes = require('./ingredient');
const recipeRoutes = require('./recipe');
const userRoutes = require('./user/index');
const staffRoutes = require('./staff/index');

module.exports = {
  equipmentRoutes,
  ingredientRoutes,
  recipeRoutes,
  userRoutes,
  staffRoutes
};