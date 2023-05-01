import { number, object, string } from 'superstruct';

export const validFriendship = object({
  userId:   number(),
  friendId: number(),
  status1:  string(),
  status2:  string()
});
