const { struct } = require('superstruct');

const validRegisterRequest = struct({
  email: 'string',
  password: 'string',
  username: 'string'
});

module.exports = validRegisterRequest;