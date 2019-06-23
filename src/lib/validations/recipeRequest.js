const { struct } = require('superstruct');

const validRecipeRequest = struct({
  recipeId: 'number',
  recipeTypeId: 'number',
  cuisineId: 'number',
  title: 'string'
});

module.exports = validRecipeRequest;