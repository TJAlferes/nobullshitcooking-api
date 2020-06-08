import { number, object, optional, string } from 'superstruct';

export const validCuisineRequest = object({
  cuisineId: number(),
  cuisineName: optional(string())
});