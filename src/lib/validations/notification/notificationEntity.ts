import { struct } from 'superstruct';

export const validNotificationEntity = struct({
  senderId: 'number',
  receiverId: 'number',
  read: 'number',
  type: 'string',
  note: 'string',
  createdOn: 'string'
});