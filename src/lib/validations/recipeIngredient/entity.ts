import { number, object } from 'superstruct';

export const validRecipeIngredientEntity = object({
  recipeId: number(),
  ingredientId: number(),
  amount: number(),
  measurementId: number()
});