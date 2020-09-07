import { number, object } from 'superstruct';

export const validRecipeMethodEntity = object({
  recipeId: number(),
  methodId: number()
});