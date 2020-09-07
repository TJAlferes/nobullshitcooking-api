import { number, object, optional, string } from 'superstruct';

export const validIngredientTypeRequest = object({
  id: number(),
  name: optional(string())
});