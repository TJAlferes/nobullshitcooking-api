import { IChatWhisper, IChatUser, KWhisper } from './types';

export function ChatWhisper(
  text: string,
  to: string,
  user: IChatUser
): IChatWhisper {
  return {
    kind: KWhisper,
    id: user.username + (new Date).getTime().toString(),
    text,
    to,
    user
  };
}