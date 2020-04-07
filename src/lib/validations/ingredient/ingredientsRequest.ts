import { struct } from 'superstruct';

export const validIngredientsRequest = struct({
  types: ['string?|number?'],
  starting: 'number',
  display: 'number'
});