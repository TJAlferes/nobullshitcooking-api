const { struct } = require('superstruct');

const validVerifyRequest = struct({
  email: 'string',
  pass: 'string',
  confirmationCode: 'string'
});

module.exports = validVerifyRequest;