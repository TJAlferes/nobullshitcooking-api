import { array, number, object, optional, string } from 'superstruct';

export const validEquipmentsRequest = object({
  types: array(optional(string()) || optional(number())),  // ?
  starting: number(),
  display: number()
});