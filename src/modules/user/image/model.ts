import { assert, boolean } from "superstruct";

import { UUIDv7StringId } from "../../shared/model";

export class UserImage {
  private user_id;
  private image_id;
  private current;

  private constructor(params: ConstructorParams) {
    this.user_id  = UUIDv7StringId(params.user_id);
    this.image_id = UUIDv7StringId(params.image_id);
    this.current  = Current(params.current);
  }

  static create(params: CreateParams) {
    return new UserImage(params);
  }

  getDTO() {
    return {
      user_id:  this.user_id,
      image_id: this.image_id,
      current:  this.current
    };
  }
}

function Current(current: boolean) {
  assert(current, boolean());
  return current;
}

type CreateParams = {
  user_id:  string;
  image_id: string;
  current:  boolean;
};

type ConstructorParams = CreateParams;
