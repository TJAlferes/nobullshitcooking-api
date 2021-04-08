import { IMessage, PUBLIC } from './types';

export function PublicMessage(
  to: string,
  from: string,
  text: string
): IMessage {
  return {
    kind: PUBLIC,
    id: from + (new Date).getTime().toString(),
    to,
    from,
    text
  };
}