const { struct } = require('superstruct');

const validUserEntity = struct(
  {
    email: 'string',
    pass: 'string',
    username: 'string',
    avatar: 'string?',
  },
  {
    avatar: 'nobsc-user-default.png',
  }
);

module.exports = validUserEntity;