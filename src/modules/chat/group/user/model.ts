import { UUIDv7StringId } from "../../../shared/model";

export class ChatgroupUser {
  private chatgroup_id;
  private user_id;
  //private is_admin;
  //private is_muted;

  private constructor(params: ConstructorParams) {
    this.chatgroup_id = UUIDv7StringId(params.chatgroup_id);
    this.user_id      = UUIDv7StringId(params.user_id);
  }

  static create(params: CreateParams) {
    return new ChatgroupUser(params);
  }

  getDTO() {
    return {
      chatgroup_id: this.chatgroup_id,
      user_id:      this.user_id
    };
  }
}

type CreateParams = {
  chatgroup_id: string;
  user_id:      string;
};

type ConstructorParams = CreateParams;
