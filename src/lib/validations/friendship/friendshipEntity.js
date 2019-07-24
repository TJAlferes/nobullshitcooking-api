const { struct } = require('superstruct');

const validFriendshipEntity = struct({
  userId: 'number',
  friendId: 'number',
  status: 'string'
});

module.exports = validFriendshipEntity;