import { Pool, RowDataPacket } from 'mysql2/promise';

export class FriendshipRepository implements IFriendshipRepository {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  /*
  each relationship is represented by two records in the table,
  one for each side (each user) (except for block/unblock, which must be one-sided)

  as you will see below, double (reversed params) execution is needed in any INSERT, UPDATE, and DELETE queries
  to affect both sides of the relationship (again, except for block/unblock, which must be one-sided)
  */

  async getByFriendId(userId: number, friendId: number) {
    const sql = `SELECT user_id, friend_id, status FROM friendships WHERE user_id = ? AND friend_id = ?`;
    const [ [ row ] ] = await this.pool.execute<Friendship[]>(sql, [userId, friendId]);
    return row;
  }

  async checkIfBlockedBy(userId: number, friendId: number) {
    const sql = `SELECT user_id, friend_id, status FROM friendships WHERE user_id = ? AND friend_id = ? AND status = "blocked"`;
    const [ [ row ] ] = await this.pool.execute<Friendship[]>(sql, [friendId, userId]);
    return row;
  }

  // change
  async view(userId: number) {
    const sql = `
      SELECT u.id AS user_id, u.username, f.status
      FROM users u
      INNER JOIN friendships f ON u.id = f.friend_id
      WHERE
        f.user_id = ? AND
        f.status IN ("accepted", "pending-received", "blocked")
    `;
    const [ rows ] = await this.pool.execute<Friend[]>(sql, [userId]);
    return rows;
  }

  async viewAccepted(userId: number) {
    const sql = `
      SELECT u.id AS user_id, u.username, f.status
      FROM users u
      INNER JOIN friendships f ON u.id = f.friend_id
      WHERE f.user_id = ? AND f.status = "accepted"
    `;
    const [ rows ] = await this.pool.execute<Friend[]>(sql, [userId]);
    return rows;
  }

  async viewPending(userId: number) {
    const sql = `
      SELECT u.id AS user_id, u.username, f.status
      FROM users u
      INNER JOIN friendships f ON u.id = f.friend_id
      WHERE f.user_id = ? AND f.status = "pending-received"
    `;
    const [ rows ] = await this.pool.execute<Friend[]>(sql, [userId]);
    return rows;
  }

  async viewBlocked(userId: number) {
    const sql = `
      SELECT u.id AS user_id, u.username, f.status
      FROM users u
      INNER JOIN friendships f ON u.id = f.friend_id
      WHERE f.user_id = ? AND f.status = "blocked"
    `;
    const [ rows ] = await this.pool.execute<Friend[]>(sql, [userId]);
    return rows;
  }

  async create({ userId, friendId, status1, status2 }: ICreatingFriendship) {
    const sql = `INSERT INTO friendships (user_id, friend_id, status) VALUES (?, ?, ?)`;
    await this.pool.execute(sql, [userId, friendId, status1]);
    await this.pool.execute(sql, [friendId, userId, status2]);
  }

  async accept(userId: number, friendId: number) {
    const sql1 = `UPDATE friendships SET status = "accepted" WHERE user_id = ? AND friend_id = ? AND status = "pending-received" LIMIT 1`;
    const sql2 = `UPDATE friendships SET status = "accepted" WHERE user_id = ? AND friend_id = ? AND status = "pending-sent" LIMIT 1`;
    await this.pool.execute(sql1, [userId, friendId]);
    await this.pool.execute(sql2, [friendId, userId]);
  }

  async reject(userId: number, friendId: number) {
    const sql = `DELETE FROM friendships WHERE user_id = ? AND friend_id = ? AND status != "blocked" LIMIT 1`;
    await this.pool.execute(sql, [userId, friendId]);
    await this.pool.execute(sql, [friendId, userId]);
  }

  async delete(userId: number, friendId: number) {
    const sql = `DELETE FROM friendships WHERE user_id = ? AND friend_id = ? AND status != "blocked" LIMIT 1`;
    await this.pool.execute(sql, [userId, friendId]);
    await this.pool.execute(sql, [friendId, userId]);
  }

  async block(userId: number, friendId: number) {
    const sql1 = `DELETE FROM friendships WHERE user_id = ? AND friend_id = ? LIMIT 1`;
    const sql2 = `INSERT INTO friendships (user_id, friend_id, status) VALUES (?, ?, "blocked")`;
    await this.pool.execute(sql1, [userId, friendId]);
    await this.pool.execute(sql1, [friendId, userId]);
    await this.pool.execute(sql2, [userId, friendId]);
  }
  
  async unblock(userId: number, friendId: number) {
    const sql = `DELETE FROM friendships WHERE user_id = ? AND friend_id = ? LIMIT 1`;
    await this.pool.execute(sql, [userId, friendId]);
  }

  async deleteAllByUserId(userId: number) {
    const sql1 = `DELETE FROM friendships WHERE user_id = ?`;
    const sql2 = `DELETE FROM friendships WHERE friend_id = ?`;
    await this.pool.execute(sql1, [userId]);
    await this.pool.execute(sql2, [userId]);
  }
}

type Row =  Promise<RowDataPacket>;

export interface IFriendshipRepository {
  pool:              Pool;
  getByFriendId:     (userId: number, friendId: number) => Promise<Friendship>;
  checkIfBlockedBy:  (userId: number, friendId: number) => Promise<Friendship>;
  view:              (userId: number) =>                   Promise<Friend[]>;
  viewAccepted:      (userId: number) =>                   Promise<Friend[]>;
  viewPending:       (userId: number) =>                   Promise<Friend[]>;
  viewBlocked:       (userId: number) =>                   Promise<Friend[]>;
  create:            (friendship: ICreatingFriendship) =>  Promise<void>;
  accept:            (userId: number, friendId: number) => Promise<void>;
  reject:            (userId: number, friendId: number) => Promise<void>;
  delete:            (userId: number, friendId: number) => Promise<void>;
  block:             (userId: number, friendId: number) => Promise<void>;
  unblock:           (userId: number, friendId: number) => Promise<void>;
  deleteAllByUserId: (userId: number) =>                   Promise<void>;
}

type ICreatingFriendship = {
  userId:   number;
  friendId: number;
  status1:  string;
  status2:  string;
};

type Friendship = RowDataPacket & {
  user_id:   number;
  friend_id: number;
  status:    string;
};

type Friend = RowDataPacket & {
  user_id:  number;  // ??? why ???
  username: string;
  status:   string;
};
