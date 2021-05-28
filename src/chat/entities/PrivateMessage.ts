import { IChatUser, IMessage, PRIVATE } from './types';

export function PrivateMessage(
  to: string,
  from: IChatUser,
  text: string
): IMessage {
  return {
    kind: PRIVATE,
    id: from.username + (new Date).getTime().toString(),
    to,
    from,
    text
  };
}