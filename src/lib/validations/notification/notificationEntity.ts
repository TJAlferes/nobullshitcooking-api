const { struct } = require('superstruct');

const validNotificationEntity = struct({
  senderId: 'number',
  receiverId: 'number',
  read: 'number',
  type: 'string',
  note: 'string',
  createdOn: 'string'
});

module.exports = validNotificationEntity;