import { object, string} from 'superstruct';

export const validFriendshipEntity = object({
  user: string(),
  friend: string(),
  status1: string(),
  status2: string()
});