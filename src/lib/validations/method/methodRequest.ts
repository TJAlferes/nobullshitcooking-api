import { number, object, optional, string } from 'superstruct';

export const validMethodRequest = object({
  methodId: number(),
  methodName: optional(string())
});