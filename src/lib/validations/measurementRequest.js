const { struct } = require('superstruct');

const validMeasurementRequest = struct({
  measurementId: 'number',
  measurementName: 'string?'
});

module.exports = validMeasurementRequest;