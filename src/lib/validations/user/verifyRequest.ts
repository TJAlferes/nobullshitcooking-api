import { struct } from 'superstruct';

export const validVerifyRequest = struct({
  email: 'string',
  pass: 'string',
  confirmationCode: 'string'
});