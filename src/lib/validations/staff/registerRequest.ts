import { struct } from 'superstruct';

const validRegisterRequest = struct({
  email: 'string',
  pass: 'string',
  staffname: 'string'
});

module.exports = validRegisterRequest;