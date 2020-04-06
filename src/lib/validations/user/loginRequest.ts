import { struct } from 'superstruct';

const validLoginRequest = struct({
  email: 'string',
  pass: 'string'
});

module.exports = validLoginRequest;