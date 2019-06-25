const { struct } = require('superstruct');

const validCuisineRequest = struct({
  cuisineId: 'number',
  cuisineName: 'string?'
});

module.exports = validCuisineRequest;