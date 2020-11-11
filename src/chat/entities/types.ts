export type Message = IChatMessage | IChatWhisper;

export const KMessage = "message" as const;
export const KWhisper = "whisper" as const;

export interface IChatMessage {
  kind: typeof KMessage;
  id: string;
  text: string;
  room: string;
  user: IChatUser;
}

export interface IChatWhisper {
  kind: typeof KWhisper;
  id: string;
  text: string;
  to: string;
  user: IChatUser;
}

export interface IChatUser {
  username: string;
  avatar: string;
}