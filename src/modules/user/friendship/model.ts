import { assert, string } from 'superstruct';

import { UUIDv7StringId } from '../../shared/model';

export class Friendship {
  private user_id;
  private friend_id;
  private status;

  private constructor(params: FriendshipParams) {
    this.user_id   = UUIDv7StringId(params.user_id);
    this.friend_id = UUIDv7StringId(params.friend_id);
    this.status    = FriendshipStatus(params.status);
  }
}

export function FriendshipStatus(status: string) {
  assert(status, string());
  if (
       status === "pending-sent"
    || status === "pending-received"
    || status === "accepted"
    || status === "blocked"
  ) {
    return status;
  }
  throw new Error("Invalid friendship status.")
}

type FriendshipParams = {
  user_id:   string;
  friend_id: string;
  status:    string;
};
