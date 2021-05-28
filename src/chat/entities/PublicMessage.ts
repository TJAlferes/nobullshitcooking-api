import { IChatUser, IMessage, PUBLIC } from './types';

export function PublicMessage(
  to: string,
  from: IChatUser,
  text: string
): IMessage {
  return {
    kind: PUBLIC,
    id: from.username + (new Date).getTime().toString(),
    to,
    from,
    text
  };
}