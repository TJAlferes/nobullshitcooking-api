import { struct } from 'superstruct';

export const validMeasurementRequest = struct({
  measurementId: 'number',
  measurementName: 'string?'
});