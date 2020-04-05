const { struct } = require('superstruct');

const validLoginRequest = struct({
  email: 'string',
  pass: 'string'
});

module.exports = validLoginRequest;