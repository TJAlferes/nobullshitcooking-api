import { IChatUser } from './ChatUser';

export interface IChatMessage {
  chatMessageId: string
  chatMessageText: string
  room: string
  user: IChatUser
}

export function ChatMessage(
  chatMessageText: string,
  room: string,
  user: IChatUser
): IChatMessage {
  return {
    chatMessageId: user.userId + (new Date).getTime().toString(),
    chatMessageText,
    room,
    user
  };
};