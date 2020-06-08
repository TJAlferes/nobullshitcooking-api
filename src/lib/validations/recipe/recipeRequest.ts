import { number, object, optional, string } from 'superstruct';

export const validRecipeRequest = object({
  recipeId: number(),
  recipeTypeId: optional(number()),
  cuisineId: optional(number()),
  title: optional(string())
});