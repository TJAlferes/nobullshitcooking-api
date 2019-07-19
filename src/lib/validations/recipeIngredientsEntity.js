const { struct } = require('superstruct');

const validRecipeIngredientsEntity = struct({
  ingredientId: 'number',
  amount: 'number',
  measurementId: 'number'
});

module.exports = validRecipeIngredientsEntity;