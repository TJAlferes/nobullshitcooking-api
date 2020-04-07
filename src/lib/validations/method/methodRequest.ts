import { struct } from 'superstruct';

export const validMethodRequest = struct({
  methodId: 'number',
  methodName: 'string?'
});