import { IChatUser } from './types';

export function ChatUser(
  id: number,
  username: string,
  avatar: string
): IChatUser {
  return {id, username, avatar};
}