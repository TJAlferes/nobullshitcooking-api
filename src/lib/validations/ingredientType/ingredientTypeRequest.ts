import { number, object, optional, string } from 'superstruct';

export const validIngredientTypeRequest = object({
  ingredientTypeId: number(),
  ingredientTypeName: optional(string())
});