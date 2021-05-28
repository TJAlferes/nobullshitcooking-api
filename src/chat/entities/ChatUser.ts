import { IChatUser } from './types';

export function ChatUser(id: number, username: string): IChatUser {
  return {id, username};
}