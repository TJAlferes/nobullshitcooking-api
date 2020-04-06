import { struct } from 'superstruct';

const validEquipmentsRequest = struct({
  types: ['string?|number?'],
  starting: 'number',
  display: 'number'
});

module.exports = validEquipmentsRequest;