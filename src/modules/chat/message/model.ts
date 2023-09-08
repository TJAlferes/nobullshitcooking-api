import { assert, string } from 'superstruct';

import { GenerateUUIDv7StringId, UUIDv7StringId } from '../../shared/model';

export class Chatmessage {
  private chatmessage_id;
  private chatroom_id;
  private sender_id;
  private receiver_id;
  private content;
  //private image_id;
  //private video_id;

  private constructor(params: ConstructorParams) {
    this.chatmessage_id = UUIDv7StringId(params.chatmessage_id);
    this.chatroom_id    = UUIDv7StringId(params.chatroom_id);
    this.sender_id      = Username(params.sender_id);    // ALSO ALLOW SOCKETS ?
    this.receiver_id    = Username(params.receiver_id);  // ALSO ALLOW SOCKETS ?
    this.content        = Content(params.content);
    //this.image_id       = params.image_id ? UUIDv7StringId(params.image_id) : undefined;
    //this.video_id       = params.video_id ? UUIDv7StringId(params.video_id) : undefined;
  }

  static create(params: CreateParams) {
    const chatmessage_id = GenerateUUIDv7StringId();
    return new Chatmessage({...params, chatmessage_id});
  }

  getDTO() {
    return {
      chatmessage_id: this.chatmessage_id,
      chatroom_id:    this.chatroom_id,
      sender_id:      this.sender_id,
      receiver_id:    this.receiver_id,
      content:        this.content,
      //image_id:       this.image_id,
      //video_id:       this.video_id
    };
  }
}

export const PRIVATE = "private" as const;
export const PUBLIC  = "public" as const;

export function Kind(kind: typeof PRIVATE | typeof PUBLIC) {
  if (kind === "private" || kind === "public") {
    return kind;
  }
  throw new Error ("Chatmessage kind must be 'private' or 'public'");
}

export function Username(username: string) {
  assert(username, string());
  if (username.length < 6) {
    throw new Error("Username must be at least 6 characters.");
  }
  if (username.length > 20) {
    throw new Error("Username must be no more than 20 characters.");
  }
  return username;
}

export function Content(content: string) {
  assert(content, string());
  if (content.length > 1000) {
    throw new Error("Chatmessage content must be no more than 1,000 characters.");
  }
  return content;
}

export type CreateParams = {
  chatroom_id: string;
  sender_id:   string;
  receiver_id: string;
  content:     string;
  //image_id?:   string;
  //video_id?:   string;
};

export type UpdateParams = CreateParams & {
  chatmessage_id: string;
}

export type ConstructorParams = UpdateParams;
