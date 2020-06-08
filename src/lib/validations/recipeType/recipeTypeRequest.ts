import { number, object, optional, string } from 'superstruct';

export const validRecipeTypeRequest = object({
  recipeTypeId: number(),
  recipeTypeName: optional(string())
});