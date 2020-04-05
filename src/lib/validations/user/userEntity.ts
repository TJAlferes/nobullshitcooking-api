const { struct } = require('superstruct');

const validUserEntity = struct(
  {
    email: 'string',
    pass: 'string',
    username: 'string',
    avatar: 'string?',
    confirmationCode: 'string?'
  },
  {
    avatar: 'nobsc-user-default',
    confirmationCode: null
  }
);

module.exports = validUserEntity;