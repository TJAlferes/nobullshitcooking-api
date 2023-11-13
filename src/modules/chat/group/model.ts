import { assert, string } from 'superstruct';

import { ValidationException } from '../../../utils/exceptions';
import { GenerateUUIDv7StringId, UUIDv7StringId } from '../../shared/model';

export class Chatgroup {
  private chatgroup_id;
  private owner_id;
  private chatgroup_name;
  private invite_code;

  private constructor(params: ConstructorParams) {
    this.chatgroup_id   = UUIDv7StringId(params.chatgroup_id);
    this.owner_id       = UUIDv7StringId(params.owner_id);
    this.chatgroup_name = ChatgroupName(params.chatgroup_name);
    this.invite_code    = UUIDv7StringId(params.invite_code);
  }

  static create(params: CreateParams) {
    const chatgroup_id = GenerateUUIDv7StringId();
    const invite_code  = GenerateUUIDv7StringId();
    return new Chatgroup({...params, chatgroup_id, invite_code});
  }

  getDTO() {
    return {
      chatgroup_id:   this.chatgroup_id,
      owner_id:       this.owner_id, 
      chatgroup_name: this.chatgroup_name,
      invite_code:    this.invite_code  
    };
  }
}

function ChatgroupName(name: string) {
  assert(name, string());
  if (name.length < 2) {
    throw ValidationException('Chatgroup name must be at least 2 characters.');
  }
  if (name.length > 32) {
    throw ValidationException('Chatgroup name must be no more than 32 characters.');
  }
  return name;
}

type CreateParams = {
  owner_id:       string;
  chatgroup_name: string;
};

type UpdateParams = CreateParams & {
  chatgroup_id: string;
};

type ConstructorParams = CreateParams & {
  chatgroup_id: string;
  invite_code:  string;
};
