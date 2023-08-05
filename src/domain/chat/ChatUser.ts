import { assert, string } from 'superstruct';

import { Username } from '../User';

export class ChatUser {
  private sessionId;  // ???
  private username;
  //private chatUserRepo: ChatUserRepoInterface;

  private constructor(params: ChatUserParams) {
    this.sessionId = SessionId(params.sessionId);  // ???
    this.username  = Username(params.username);
  }

  static create(params: ChatUserParams): ChatUser {
    const chatUser = new ChatUser(params);
    //chatUserRepo.create(chatUser);  // here?
    return chatUser;
  }
}

export function SessionId(sessionId: string) {  // ???
  assert(sessionId, string());
  return sessionId;
}

type ChatUserParams = {
  sessionId: string;  // ???
  username: string;
};
