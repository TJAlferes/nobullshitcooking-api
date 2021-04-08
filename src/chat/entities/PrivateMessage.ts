import { IMessage, PRIVATE } from './types';

export function PrivateMessage(
  to: string,
  from: string,
  text: string
): IMessage {
  return {
    kind: PRIVATE,
    id: from + (new Date).getTime().toString(),
    to,
    from,
    text
  };
}