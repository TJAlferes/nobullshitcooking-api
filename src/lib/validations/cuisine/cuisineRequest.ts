import { struct } from 'superstruct';

const validCuisineRequest = struct({
  cuisineId: 'number',
  cuisineName: 'string?'
});

module.exports = validCuisineRequest;