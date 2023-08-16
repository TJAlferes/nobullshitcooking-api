import { assert, string } from 'superstruct';

import { GenerateUUIDv7StringId, UUIDv7StringId } from './shared';

export class Chatmessage {
  private chatmessage_id;
  private kind;
  private chatroom_id;
  private sender_id;
  private receiver_id;
  private content;
  private image_id;
  private video_id;
  // Timestamps -- handled by MySQL
  private created_at: Date | null = null;
  private updated_at: Date | null = null;

  private constructor(params: ConstructorParams) {
    this.chatmessage_id = UUIDv7StringId(params.chatmessage_id);
    this.kind           = Kind(params.kind);
    this.chatroom_id    = UUIDv7StringId(params.chatroom_id);
    this.sender_id      = Username(params.sender_id);    // ALSO ALLOW SOCKETS ?
    this.receiver_id    = Username(params.receiver_id);  // ALSO ALLOW SOCKETS ?
    this.content        = Content(params.content);
    this.image_id       = params.image_id ? UUIDv7StringId(params.image_id) : undefined;
    this.video_id       = params.video_id ? UUIDv7StringId(params.video_id) : undefined;
  }

  static create(params: CreateParams) {
    const chatmessage_id = GenerateUUIDv7StringId();

    const chatMessage = new Chatmessage({...params, chatmessage_id});

    return chatMessage;
  }

  //static update(params: UpdateParams) {}
}

export function Kind(kind: typeof PRIVATE | typeof PUBLIC) {
  if (kind === "private" || kind === "public") {
    return kind;
  }
  throw new Error ("Chat message kind must be 'private' or 'public'");
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
  kind:        typeof PRIVATE | typeof PUBLIC;
  chatroom_id: string;  // make optional and provide default?
  sender_id:   string;
  receiver_id: string;
  content:     string;
  image_id?:   string;
  video_id?:   string;
};

export type UpdateParams = CreateParams & {
  chatmessage_id: string;
}

export type ConstructorParams = UpdateParams;

export const PRIVATE = "private" as const;
export const PUBLIC  = "public" as const;
