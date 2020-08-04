import { IChatUser } from './ChatUser';

export function Whisper(
  whisperText: string,
  to: string,
  user: IChatUser
): IWhisper {
  return {
    whisperId: user.userId + (new Date).getTime().toString(),
    whisperText,
    to,
    user
  };
};

export interface IWhisper {
  whisperId: string;
  whisperText: string;
  to: string;
  user: IChatUser;
}