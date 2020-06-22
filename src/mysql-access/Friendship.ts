import { Pool, RowDataPacket } from 'mysql2/promise';

export class Friendship implements IFriendship {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.getFriendshipByFriendId = this.getFriendshipByFriendId.bind(this);
    this.checkIfBlockedBy = this.checkIfBlockedBy.bind(this);
    this.viewMyFriendships = this.viewMyFriendships.bind(this);
    this.viewMyAcceptedFriendships =
      this.viewMyAcceptedFriendships.bind(this);
    this.viewMyPendingFriendships =
      this.viewMyPendingFriendships.bind(this);
    this.viewMyBlockedUsers = this.viewMyBlockedUsers.bind(this);
    this.createFriendship = this.createFriendship.bind(this);
    this.acceptFriendship = this.acceptFriendship.bind(this);
    this.rejectFriendship = this.rejectFriendship.bind(this);
    this.deleteFriendship = this.deleteFriendship.bind(this);
    this.blockUser = this.blockUser.bind(this);
    this.unblockUser = this.unblockUser.bind(this);
    this.deleteAllMyFriendships = this.deleteAllMyFriendships.bind(this);
  }

  /*
    each relationship is represented
    by two records in the table,
    one for each side (each user),
    (except for block/unblock, which must be one-sided)

    as you will see below,
    double (reversed params) execution is needed in
    any INSERT, UPDATE, and DELETE queries
    in order to affect both sides of the relationship,
    (except for block/unblock, which must be one-sided)
  */

  async getFriendshipByFriendId(userId: number, friendId: number) {
    const sql = `
      SELECT user_id, friend_id, status
      FROM nobsc_friendships
      WHERE user_id = ? AND friend_id = ?
    `;
    const [ friendship ] = await this.pool
    .execute<RowDataPacket[]>(sql, [userId, friendId]);
    return friendship;
  }

  async checkIfBlockedBy(userId: number, friendId: number) {
    const sql = `
      SELECT user_id, friend_id
      FROM nobsc_friendships
      WHERE user_id = ? AND friend_id = ? AND status = "blocked"
    `;
    const [ blockedBy ] = await this.pool
    .execute<RowDataPacket[]>(sql, [friendId, userId]);
    return blockedBy;
  }

  async viewMyFriendships(userId: number) {
    const sql = `
      SELECT
        u.user_id AS user_id,
        u.username AS username,
        u.avatar AS avatar,
        f.status AS status
      FROM nobsc_users u
      INNER JOIN nobsc_friendships f ON u.user_id = f.friend_id
      WHERE
        f.user_id = ? AND
        f.status IN ("accepted", "pending-received", "blocked")
    `;
    const [ friendships ] = await this.pool
    .execute<RowDataPacket[]>(sql, [userId]);
    return friendships;
  }

  async viewMyAcceptedFriendships(userId: number) {
    const sql = `
      SELECT
        u.user_id AS user_id,
        u.username AS username,
        u.avatar AS avatar,
        f.status AS status
      FROM nobsc_users u
      INNER JOIN nobsc_friendships f ON u.user_id = f.friend_id
      WHERE f.user_id = ? AND f.status = "accepted"
    `;
    const [ acceptedFriendships ] = await this.pool
    .execute<RowDataPacket[]>(sql, [userId]);
    return acceptedFriendships;
  }

  async viewMyPendingFriendships(userId: number) {
    const sql = `
      SELECT
        u.user_id AS user_id,
        u.username AS username,
        u.avatar AS avatar,
        f.status AS status
      FROM nobsc_users u
      INNER JOIN nobsc_friendships f ON u.user_id = f.friend_id
      WHERE f.user_id = ? AND f.status = "pending-received"
    `;
    const [ pendingFriendships ] = await this.pool
    .execute<RowDataPacket[]>(sql, [userId]);
    return pendingFriendships;
  }

  async viewMyBlockedUsers(userId: number) {
    const sql = `
      SELECT
        u.user_id AS user_id,
        u.username AS username,
        u.avatar AS avatar,
        f.status AS status
      FROM nobsc_users u
      INNER JOIN nobsc_friendships f ON u.user_id = f.friend_id
      WHERE f.user_id = ? AND f.status = "blocked"
    `;
    const [ blockedUsers ] = await this.pool
    .execute<RowDataPacket[]>(sql, [userId]);
    return blockedUsers;
  }

  async createFriendship({
    userId,
    friendId,
    status1,
    status2
  }: ICreatingFriendship) {
    const sql = `
      INSERT INTO nobsc_friendships (user_id, friend_id, status)
      VALUES (?, ?, ?)
    `;
    const [ pendingFriendship ] = await this.pool
    .execute<RowDataPacket[]>(sql, [userId, friendId, status1]);
    await this.pool.execute<RowDataPacket[]>(sql, [friendId, userId, status2]);
    return pendingFriendship;
  }

  async acceptFriendship(userId: number, friendId: number) {
    const sql1 = `
      UPDATE nobsc_friendships
      SET status = "accepted"
      WHERE user_id = ? AND friend_id = ? AND status = "pending-received"
      LIMIT 1
    `;
    const sql2 = `
      UPDATE nobsc_friendships
      SET status = "accepted"
      WHERE user_id = ? AND friend_id = ? AND status = "pending-sent"
      LIMIT 1
    `;
    const [ acceptedFriendship ] = await this.pool
    .execute<RowDataPacket[]>(sql1, [userId, friendId]);
    await this.pool.execute<RowDataPacket[]>(sql2, [friendId, userId,]);
    return acceptedFriendship;
  }

  async rejectFriendship(userId: number, friendId: number) {
    const sql = `
      DELETE
      FROM nobsc_friendships
      WHERE user_id = ? AND friend_id = ? AND status != "blocked"
      LIMIT 1
    `;
    const [ rejectedFriendship ] = await this.pool
    .execute<RowDataPacket[]>(sql, [userId, friendId]);
    await this.pool.execute<RowDataPacket[]>(sql, [friendId, userId]);
    return rejectedFriendship;
  }

  async deleteFriendship(userId: number, friendId: number) {
    const sql = `
      DELETE
      FROM nobsc_friendships
      WHERE user_id = ? AND friend_id = ? AND status != "blocked"
      LIMIT 1
    `;
    const [ deletedFriendship ] = await this.pool
    .execute<RowDataPacket[]>(sql, [userId, friendId]);
    await this.pool.execute<RowDataPacket[]>(sql, [friendId, userId]);
    return deletedFriendship;
  }

  async blockUser(userId: number, friendId: number) {
    const sql1 = `
      DELETE
      FROM nobsc_friendships
      WHERE user_id = ? AND friend_id = ?
      LIMIT 1
    `;
    const sql2 = `
      INSERT INTO nobsc_friendships (user_id, friend_id, status)
      VALUES (?, ?, "blocked")
    `;
    await this.pool.execute(sql1, [userId, friendId]);
    await this.pool.execute(sql1, [friendId, userId]);
    const [ blockedUser ] = await this.pool
    .execute<RowDataPacket[]>(sql2, [userId, friendId]);
    return blockedUser;
  }

  async unblockUser(userId: number, friendId: number) {
    const sql = `
      DELETE
      FROM nobsc_friendships
      WHERE user_id = ? AND friend_id = ?
      LIMIT 1
    `;
    const [ unblockedUser ] = await this.pool
    .execute<RowDataPacket[]>(sql, [userId, friendId]);
    return unblockedUser;
  }

  async deleteAllMyFriendships(userId: number) {
    const sql1 = `
      DELETE
      FROM nobsc_friendships
      WHERE user_id = ?
    `;
    const sql2 = `
      DELETE
      FROM nobsc_friendships
      WHERE friend_id = ?
    `;
    await this.pool.execute<RowDataPacket[]>(sql1, [userId]);
    await this.pool.execute<RowDataPacket[]>(sql2, [userId]);
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IFriendship {
  pool: Pool;
  getFriendshipByFriendId(userId: number, friendId: number): Data;
  checkIfBlockedBy(userId: number, friendId: number): Data;
  viewMyFriendships(userId: number): Data;
  viewMyAcceptedFriendships(userId: number): Data;
  viewMyPendingFriendships(userId: number): Data;
  viewMyBlockedUsers(userId: number): Data;
  createFriendship({
    userId,
    friendId,
    status1,
    status2
  }: ICreatingFriendship): Data;
  acceptFriendship(userId: number, friendId: number): Data;
  rejectFriendship(userId: number, friendId: number): Data;
  deleteFriendship(userId: number, friendId: number): Data;
  blockUser(userId: number, friendId: number): Data;
  unblockUser(userId: number, friendId: number): Data;
  deleteAllMyFriendships(userId: number): void;
}

interface ICreatingFriendship {
  userId: number;
  friendId: number;
  status1: string;
  status2: string;
}