import { struct } from 'superstruct';

const validFavoriteRecipeEntity = struct({
  userId: 'number',
  recipeId: 'number'
});

module.exports = validFavoriteRecipeEntity;