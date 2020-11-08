import { IChatUser } from './types';

export function ChatUser(
  id: string,
  username: string,
  avatar: string
): IChatUser {
  return {id, username, avatar};
}