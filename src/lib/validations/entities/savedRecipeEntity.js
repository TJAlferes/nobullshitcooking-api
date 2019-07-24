const { struct } = require('superstruct');

const validSavedRecipeEntity = struct({
  userId: 'number',
  recipeId: 'number'
});

module.exports = validSavedRecipeEntity;