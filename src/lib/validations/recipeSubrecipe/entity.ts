import { number, object } from 'superstruct';

export const validRecipeSubrecipeEntity = object({
  recipeId: number(),
  subrecipeId: number(),
  amount: number(),
  measurementId: number()
});