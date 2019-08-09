const { struct } = require('superstruct');

const validIngredientsRequest = struct({
  types: ['string?|number?'],
  starting: 'number',
  display: 'number'
});

module.exports = validIngredientsRequest;