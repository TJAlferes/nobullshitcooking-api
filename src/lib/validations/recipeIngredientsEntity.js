const { struct } = require('superstruct');

const validRecipeIngredientsEntity = struct({
  recipeId: 'number',
  ingredientId: 'number',
  amount: 'number',
  measurementId: 'number'
});

module.exports = validRecipeIngredientsEntity;