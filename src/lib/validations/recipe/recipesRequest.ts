import { struct } from 'superstruct';

export const validRecipesRequest = struct({
  types: ['string?|number?'],
  cuisines: ['string?|number?'],
  starting: 'number',
  display: 'number'
});