import { assert, string } from 'superstruct';

import { UUIDv7StringId } from '../../shared/model';

// problem: you're not expliciting defining valid state transitions in here,
// you're doing it in a mix of repo and controller
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
  throw new Error("Invalid friendship status.")
}

type CreateParams = {
  user_id:   string;
  friend_id: string;
  status:    string;
};

type ConstructorParams = CreateParams;
