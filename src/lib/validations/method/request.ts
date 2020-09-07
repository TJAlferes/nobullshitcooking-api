import { number, object, optional, string } from 'superstruct';

export const validMethodRequest = object({
  id: number(),
  name: optional(string())
});