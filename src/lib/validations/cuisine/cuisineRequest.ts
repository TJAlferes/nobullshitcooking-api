import { struct } from 'superstruct';

export const validCuisineRequest = struct({
  cuisineId: 'number',
  cuisineName: 'string?'
});