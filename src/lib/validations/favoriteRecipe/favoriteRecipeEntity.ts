import { struct } from 'superstruct';

export const validFavoriteRecipeEntity = struct({
  userId: 'number',
  recipeId: 'number'
});