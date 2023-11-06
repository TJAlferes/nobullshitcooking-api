import { assert, string } from 'superstruct';

import { ValidationException } from '../../../utils/exceptions.js';
import { UUIDv7StringId } from '../../shared/model.js';

// problem: you're not expliciting defining valid state transitions in here,
// you're doing most of it in the controller and some of it in the repo
export class Friendship {
  private user_id;
  private friend_id;
  private status;

  private constructor(params: ConstructorParams) {
    this.user_id   = UUIDv7StringId(params.user_id);
    this.friend_id = UUIDv7StringId(params.friend_id);
    this.status    = FriendshipStatus(params.status);
  }

  static create(params: CreateParams) {
    return new Friendship(params);
  }

  getDTO() {
    return {
      user_id:   this.user_id,
      friend_id: this.friend_id,
      status:    this.status,
    };
  }
}

export function FriendshipStatus(status: string) {
  assert(status, string());
  if ( status === "pending-sent"
    || status === "pending-received"
    || status === "accepted"
    || status === "blocked"
  ) {
    return status;
  }
  throw ValidationException("Invalid friendship status.")
}

type CreateParams = {
  user_id:   string;
  friend_id: string;
  status:    string;
};

type ConstructorParams = CreateParams;
