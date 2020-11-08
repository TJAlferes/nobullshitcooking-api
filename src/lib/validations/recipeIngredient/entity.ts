import { number, object, string } from 'superstruct';

export const validRecipeIngredientEntity = object({
  recipe: string(),
  ingredient: string(),
  amount: number(),
  measurement: string()
});