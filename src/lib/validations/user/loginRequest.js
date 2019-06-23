const { struct } = require('superstruct');

const validLoginRequest = struct({
  email: 'string',
  password: 'string'
});

module.exports = validLoginRequest;