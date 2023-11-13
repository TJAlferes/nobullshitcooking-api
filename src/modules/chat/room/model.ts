import { assert, string } from 'superstruct';

import { ValidationException } from '../../../utils/exceptions';
import { GenerateUUIDv7StringId, UUIDv7StringId } from '../../shared/model';

export class Chatroom {
  private chatroom_id;
  private chatgroup_id;
  private chatroom_name;

  private constructor(params: ConstructorParams) {
    this.chatroom_id   = UUIDv7StringId(params.chatroom_id);
    this.chatgroup_id  = UUIDv7StringId(params.chatgroup_id);
    this.chatroom_name = ChatroomName(params.chatroom_name);
  }

  static create(params: CreateParams) {
    const chatroom_id = GenerateUUIDv7StringId();
    return new Chatroom({...params, chatroom_id});
  }

  //static update(params: UpdateParams) {}

  getDTO() {
    return {
      chatroom_id:   this.chatroom_id,
      chatgroup_id:  this.chatgroup_id,
      chatroom_name: this.chatroom_name
    };
  }
}

export function ChatroomName(name: string) {
  assert(name, string());
  if (name.length < 2) {
    throw ValidationException('Chatroom name must be at least 2 characters.');
  }
  if (name.length > 32) {
    throw ValidationException('Chatroom name must be no more than 32 characters.');
  }
  return name;
}

type CreateParams = {
  chatgroup_id:  string;
  chatroom_name: string;
};

type UpdateParams = CreateParams & {
  chatroom_id: string;
};

type ConstructorParams = UpdateParams;
