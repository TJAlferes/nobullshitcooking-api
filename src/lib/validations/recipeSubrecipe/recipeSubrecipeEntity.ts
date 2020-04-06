const { struct } = require('superstruct');

const validRecipeSubrecipeEntity = struct({
  recipeId: 'number',
  subrecipeId: 'number',
  amount: 'number',
  measurementId: 'number'
});

module.exports = validRecipeSubrecipeEntity;