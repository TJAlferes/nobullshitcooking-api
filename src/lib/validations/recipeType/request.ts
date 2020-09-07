import { number, object, optional, string } from 'superstruct';

export const validRecipeTypeRequest = object({
  id: number(),
  name: optional(string())
});