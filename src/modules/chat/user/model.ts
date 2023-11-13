import { assert, boolean, string } from 'superstruct';

import { Username } from '../../user/model';

export class ChatUser {
  private session_id;
  private username;
  private connected;
  private last_active;

  private constructor(params: ConstructorParams) {
    this.session_id  = SessionId(params.session_id);
    this.username    = Username(params.username);
    this.connected   = Connected(params.connected);
    this.last_active = Date.now();
  }

  static create(params: CreateParams) {
    return new ChatUser(params);
  }

  //static update

  getDTO() {
    return {
      session_id:  this.session_id,
      username:    this.username,
      connected:   String(this.connected),
      last_active: this.last_active.toString()
    };
  }
}

export function SessionId(session_id: string) {
  assert(session_id, string());
  return session_id;
}

export function Connected(connected: boolean) {
  assert(connected, boolean());
  return connected;
}

export function LastActive(last_active: string) {
  assert(last_active, string());
  return last_active;
}

type CreateParams = {
  session_id: string;
  username:   string;
  connected:  boolean;
};

type ConstructorParams = CreateParams;
