import { struct } from 'superstruct';

const validIngredientsRequest = struct({
  types: ['string?|number?'],
  starting: 'number',
  display: 'number'
});

module.exports = validIngredientsRequest;