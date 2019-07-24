const { struct } = require('superstruct');

const validRecipeMethodsEntity = struct({
  recipeId: 'number',
  methodId: 'number',
});

module.exports = validRecipeMethodsEntity;