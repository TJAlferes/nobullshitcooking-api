import { number, object } from 'superstruct';

export const validSavedRecipeEntity = object({
  userId: number(),
  recipeId: number()
});