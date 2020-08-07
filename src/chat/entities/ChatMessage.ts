import { IChatUser } from './ChatUser';

export function ChatMessage(
  chatMessageText: string,
  room: string,
  user: IChatUser
): IChatMessage {
  return {
    chatMessageId: user.id + (new Date).getTime().toString(),
    chatMessageText,
    room,
    user
  };
};

export interface IChatMessage {
  chatMessageId: string;
  chatMessageText: string;
  room: string;
  user: IChatUser;
}