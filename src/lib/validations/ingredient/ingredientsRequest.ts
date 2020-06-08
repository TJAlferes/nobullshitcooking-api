import { array, number, object, optional, string } from 'superstruct';

export const validIngredientsRequest = object({
  types: array(optional(string()) || optional(number())),
  starting: number(),
  display: number()
});