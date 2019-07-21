const { struct } = require('superstruct');

const validRecipeSubrecipesEntity = struct({
  recipeId: 'number',
  subrecipeId: 'number',
  amount: 'number',
  measurementId: 'number'
});

module.exports = validRecipeSubrecipesEntity;