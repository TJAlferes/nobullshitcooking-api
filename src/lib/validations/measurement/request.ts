import { number, object, optional, string } from 'superstruct';

export const validMeasurementRequest = object({
  id: number(),
  name: optional(string())
});