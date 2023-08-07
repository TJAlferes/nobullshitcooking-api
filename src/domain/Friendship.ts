import { assert, string } from 'superstruct';

import { Id } from './shared';

export class Friendship {
  private userId;
  private friendId;
  private status;

  private constructor(params: FriendshipParams) {
    this.userId   = Id(params.userId);
    this.friendId = Id(params.friendId);
    this.status   = FriendshipStatus(params.status);
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
  userId:   string;
  friendId: string;
  status:   string;
};
