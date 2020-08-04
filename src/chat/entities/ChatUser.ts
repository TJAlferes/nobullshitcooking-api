export function ChatUser(
  userId: number,
  username: string,
  avatar: string
): IChatUser {
  return {userId, username, avatar};
}

export interface IChatUser {
  userId: number;
  username: string;
  avatar: string;
}