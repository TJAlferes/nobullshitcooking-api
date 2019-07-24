const { struct } = require('superstruct');

const validIngredientsRequest = struct({
  types: ['number?'],
  starting: 'number',
  display: 'number'
});

module.exports = validIngredientsRequest;