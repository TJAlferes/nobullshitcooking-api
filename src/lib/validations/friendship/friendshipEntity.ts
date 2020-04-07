import { struct } from 'superstruct';

export const validFriendshipEntity = struct({
  userId: 'number',
  friendId: 'number',
  status1: 'string',
  status2: 'string'
});