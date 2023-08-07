import { assert, string } from 'superstruct';

import { GenerateId } from './shared';

export class Chatroom {
  private id;
  private name;
  // Timestamps -- handled by MySQL
  private created_at: Date | null = null;
  private updated_at: Date | null = null;

  private constructor(name: string) {
    this.id =   GenerateId();
    this.name = ChatroomName(name);
  }

  static create(name: string) {
    const chatRoom = new Chatroom(name);
    return chatRoom;  // only return the id?
  }
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
