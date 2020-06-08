import { number, object, optional, string } from 'superstruct';

export const validIngredientRequest = object({
  ingredientId: number(),
  ingredientTypeId: optional(number()),
  ingredientName: optional(string())
});