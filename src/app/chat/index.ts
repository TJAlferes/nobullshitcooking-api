import { uuidv7 } from 'uuidv7';

export function PublicMessage(to: string, from: string, text: string): IMessage {
  return {
    kind: PUBLIC,
    id: uuidv7(),
    to,
    from,
    text
  };
}

export function PrivateMessage(to: string, from: string, text: string): IMessage {
  return {
    kind: PRIVATE,
    id: uuidv7(),
    to,
    from,
    text
  };
}

export const PRIVATE = "private" as const;
export const PUBLIC  = "public" as const;

export interface IMessage {
  kind: typeof PRIVATE | typeof PUBLIC;
  id:   string;
  to:   string;
  from: string;
  text: string;
}

export { disconnecting, IDisconnecting }           from './disconnecting';
export { getOnlineFriends, IGetOnlineFriends }     from './getOnlineFriends';
export { getUsersInRoom }                          from './getUsersInRoom';
export { joinRoom }                                from './joinRoom';
export { rejoinRoom }                              from './rejoinRoom';
export { sendMessage }                             from './sendMessage';
export { sendPrivateMessage, ISendPrivateMessage } from './sendPrivateMessage';
