import { IChatUser } from './types';

export function ChatUser(username: string, avatar: string): IChatUser {
  return {username, avatar};
}