const { struct } = require('superstruct');

const validRecipeIngredientEntity = struct({
  recipeId: 'number',
  ingredientId: 'number',
  amount: 'number',
  measurementId: 'number'
});

module.exports = validRecipeIngredientEntity;