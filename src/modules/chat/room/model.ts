import { assert, string } from 'superstruct';

import { GenerateUUIDv7StringId, UUIDv7StringId } from './shared';

export class Chatroom {
  private chatroom_id;
  private owner_id;
  private chatroom_name;
  // Timestamps -- handled by MySQL
  private created_at: Date | null = null;
  private updated_at: Date | null = null;

  private constructor(params: ConstructorParams) {
    this.chatroom_id   = UUIDv7StringId(params.chatroom_id);
    this.owner_id      = UUIDv7StringId(params.owner_id);
    this.chatroom_name = ChatroomName(params.chatroom_name);
  }

  static create(params: CreateParams) {
    const chatroom_id = GenerateUUIDv7StringId();
    const chatRoom = new Chatroom({...params, chatroom_id});
    return chatRoom;  // only return the id?
  }

  //static update(params: UpdateParams) {}
}

export function ChatroomName(name: string) {
  assert(name, string());
  if (name.length < 2) {
    throw new Error("Chatroom name must be at least 2 characters.");
  }
  if (name.length > 32) {
    throw new Error("Chatroom name must be no more than 32 characters.");
  }
  return name;
}

type CreateParams = {
  owner_id:      string;
  chatroom_name: string;
};

type UpdateParams = CreateParams & {
  chatroom_id:   string;
};

type ConstructorParams = UpdateParams;
