import { struct } from 'superstruct';

export const validRegisterRequest = struct({
  email: 'string',
  pass: 'string',
  username: 'string'
});