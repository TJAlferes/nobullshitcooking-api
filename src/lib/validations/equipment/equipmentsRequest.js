const { struct } = require('superstruct');

const validEquipmentsRequest = struct({
  types: ['number?'],
  starting: 'number',
  display: 'number'
});

module.exports = validEquipmentsRequest;