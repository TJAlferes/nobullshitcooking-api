import { struct } from 'superstruct';

export const validLoginRequest = struct({
  email: 'string',
  pass: 'string'
});