import { struct } from 'superstruct';

const validMeasurementRequest = struct({
  measurementId: 'number',
  measurementName: 'string?'
});

module.exports = validMeasurementRequest;