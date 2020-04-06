const { struct } = require('superstruct');

const validRecipeMethodEntity = struct({
  recipeId: 'number',
  methodId: 'number',
});

module.exports = validRecipeMethodEntity;