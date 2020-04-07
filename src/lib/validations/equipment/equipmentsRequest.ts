import { struct } from 'superstruct';

export const validEquipmentsRequest = struct({
  types: ['string?|number?'],
  starting: 'number',
  display: 'number'
});