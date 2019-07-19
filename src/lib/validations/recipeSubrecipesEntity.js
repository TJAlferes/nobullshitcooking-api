const { struct } = require('superstruct');

const validRecipeSubrecipesEntity = struct({
  subrecipeId: 'number',
  amount: 'number',
  measurementId: 'number'
});

module.exports = validRecipeSubrecipesEntity;