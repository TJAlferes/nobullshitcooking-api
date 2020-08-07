export function ChatUser(
  id: number,
  username: string,
  avatar: string
): IChatUser {
  return {id, username, avatar};
}

export interface IChatUser {
  id: number;
  username: string;
  avatar: string;
}