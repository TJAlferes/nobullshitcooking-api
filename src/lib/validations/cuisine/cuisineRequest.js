const { struct } = require('superstruct');

const validCuisineRequest = struct({
  cuisineId: 'string',  // 'number'
  cuisineName: 'string?'
});

module.exports = validCuisineRequest;