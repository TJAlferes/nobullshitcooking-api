import { UUIDv7StringId } from "../../../shared/model.js";

export class ChatroomUser {
  private chatroom_id;
  private user_id;
  //private is_admin;
  //private is_muted;

  private constructor(params: ConstructorParams) {
    this.chatroom_id = UUIDv7StringId(params.chatroom_id);
    this.user_id     = UUIDv7StringId(params.user_id);
  }

  static create(params: CreateParams) {
    return new ChatroomUser(params);
  }

  getDTO() {
    return {
      chatroom_id: this.chatroom_id,
      user_id:     this.user_id
    };
  }
}

type CreateParams = {
  chatroom_id: string;
  user_id:     string;
};

type ConstructorParams = CreateParams;
