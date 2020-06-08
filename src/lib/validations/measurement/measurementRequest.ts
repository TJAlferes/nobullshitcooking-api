import { number, object, optional, string } from 'superstruct';

export const validMeasurementRequest = object({
  measurementId: number(),
  measurementName: optional(string())
});