const { struct } = require('superstruct');

const validRecipesRequest = struct({
  types: ['number?'],
  cuisines: ['number?'],
  starting: 'number',
  display: 'number'
});

module.exports = validRecipesRequest;