const { struct } = require('superstruct');

const validRecipesRequest = struct({
  types: ['string?|number?'],
  cuisines: ['string?|number?'],
  starting: 'number',
  display: 'number'
});

module.exports = validRecipesRequest;