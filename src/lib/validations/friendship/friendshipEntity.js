const { struct } = require('superstruct');

const validFriendshipEntity = struct({
  userId: 'number',
  friendId: 'number',
  status1: 'string',
  status2: 'string'
});

module.exports = validFriendshipEntity;