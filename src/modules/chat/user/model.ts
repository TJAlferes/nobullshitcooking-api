import { assert, string } from 'superstruct';

import { Username } from '../../user/model';

export class ChatUser {
  private session_id;
  private username;

  private constructor(params: ConstructorParams) {
    this.session_id = SessionId(params.session_id);
    this.username   = Username(params.username);
  }

  static create(params: CreateParams) {
    const chatUser = new ChatUser(params);
    return chatUser;
  }

  getDTO() {
    return {
      session_id: this.session_id,
      username:   this.username
    };
  }
}

export function SessionId(session_id: string) {
  assert(session_id, string());
  return session_id;
}

type CreateParams = {
  session_id: string;
  username:   string;
};

type ConstructorParams = CreateParams;
