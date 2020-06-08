import { number, object } from 'superstruct';

export const validFavoriteRecipeEntity = object({
  userId: number(),
  recipeId: number()
});