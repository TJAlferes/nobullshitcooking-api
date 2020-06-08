import { array, number, object, optional, string } from 'superstruct';

export const validRecipesRequest = object({
  types: array(optional(string()) || optional(number())),
  cuisines: array(optional(string()) || optional(number())),
  starting: number(),
  display: number()
});