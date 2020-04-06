import { struct } from 'superstruct';

const validRegisterRequest = struct({
  email: 'string',
  pass: 'string',
  username: 'string'
});

module.exports = validRegisterRequest;