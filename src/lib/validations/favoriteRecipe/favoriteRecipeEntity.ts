const { struct } = require('superstruct');

const validFavoriteRecipeEntity = struct({
  userId: 'number',
  recipeId: 'number'
});

module.exports = validFavoriteRecipeEntity;