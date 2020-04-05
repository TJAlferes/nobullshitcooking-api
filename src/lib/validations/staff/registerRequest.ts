const { struct } = require('superstruct');

const validRegisterRequest = struct({
  email: 'string',
  pass: 'string',
  staffname: 'string'
});

module.exports = validRegisterRequest;