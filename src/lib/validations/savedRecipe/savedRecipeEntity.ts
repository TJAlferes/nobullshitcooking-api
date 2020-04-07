import { struct } from 'superstruct';

export const validSavedRecipeEntity = struct({
  userId: 'number',
  recipeId: 'number'
});