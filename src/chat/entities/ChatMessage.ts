import { IChatMessage, IChatUser, KMessage } from './types';

export function ChatMessage(
  text: string,
  room: string,
  user: IChatUser
): IChatMessage {
  return {
    kind: KMessage,
    id: user.id + (new Date).getTime().toString(),
    text,
    room,
    user
  };
}