import { RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from './MySQL';

export class FriendshipRepo extends MySQLRepo implements IFriendshipRepo {
  /*
  each relationship is represented by two records in the table,
  one for each side (each user) (except for block/unblock, which must be one-sided)

  as you will see below, double (reversed params) execution is needed in any INSERT, UPDATE, and DELETE queries
  to affect both sides of the relationship (again, except for block/unblock, which must be one-sided)
  */

  async getByFriendId(params: FriendParams) {
    const sql = `SELECT user_id, friend_id, status FROM friendship WHERE user_id = ? AND friend_id = ?`;
    const [ [ row ] ] = await this.pool.execute<Friendship[]>(sql, params);
    return row;
  }

  async checkIfBlockedBy(params: FriendParams) {
    const sql = `SELECT user_id, friend_id, status FROM friendship WHERE user_id = ? AND friend_id = ? AND status = "blocked"`;
    const [ [ row ] ] = await this.pool.execute<Friendship[]>(sql, params);
    return row;
  }

  // change (DON'T let hem view the user_id???)
  async view(user_id: string) {
    const sql = `
      SELECT u.id AS user_id, u.username, f.status
      FROM user u
      INNER JOIN friendship f ON u.id = f.friend_id
      WHERE
        f.user_id = ? AND
        f.status IN ("accepted", "pending-received", "blocked")
    `;
    const [ rows ] = await this.pool.execute<FriendView[]>(sql, [user_id]);
    return rows;
  }

  async viewAccepted(user_id: string) {
    const sql = `
      SELECT u.id AS user_id, u.username, f.status
      FROM user u
      INNER JOIN friendship f ON u.id = f.friend_id
      WHERE f.user_id = ? AND f.status = "accepted"
    `;
    const [ rows ] = await this.pool.execute<FriendView[]>(sql, [user_id]);
    return rows;
  }

  async viewPending(user_id: string) {
    const sql = `
      SELECT u.id AS user_id, u.username, f.status
      FROM user u
      INNER JOIN friendship f ON u.id = f.friend_id
      WHERE f.user_id = ? AND f.status = "pending-received"
    `;
    const [ rows ] = await this.pool.execute<FriendView[]>(sql, [user_id]);
    return rows;
  }

  async viewBlocked(user_id: string) {
    const sql = `
      SELECT u.id AS user_id, u.username, f.status
      FROM user u
      INNER JOIN friendship f ON u.id = f.friend_id
      WHERE f.user_id = ? AND f.status = "blocked"
    `;
    const [ rows ] = await this.pool.execute<FriendView[]>(sql, [user_id]);
    return rows;
  }

  // this may need improvement
  async insert({ user_id, friend_id, status1, status2 }: InsertParams) {
    const sql = `INSERT INTO friendship (user_id, friend_id, status) VALUES (?, ?, ?)`;
    await this.pool.execute(sql, [user_id, friend_id, status1]);
    await this.pool.execute(sql, [friend_id, user_id, status2]);
  }

  async accept({ user_id, friend_id }: FriendParams) {
    const sql1 = `UPDATE friendship SET status = "accepted" WHERE user_id = ? AND friend_id = ? AND status = "pending-received" LIMIT 1`;
    const sql2 = `UPDATE friendship SET status = "accepted" WHERE user_id = ? AND friend_id = ? AND status = "pending-sent" LIMIT 1`;
    await this.pool.execute(sql1, [user_id, friend_id]);
    await this.pool.execute(sql2, [friend_id, user_id]);
  }

  async reject({ user_id, friend_id }: FriendParams) {
    const sql = `DELETE FROM friendship WHERE user_id = ? AND friend_id = ? AND status != "blocked" LIMIT 1`;
    await this.pool.execute(sql, [user_id, friend_id]);
    await this.pool.execute(sql, [friend_id, user_id]);
  }

  async delete({ user_id, friend_id }: FriendParams) {
    const sql = `DELETE FROM friendship WHERE user_id = ? AND friend_id = ? AND status != "blocked" LIMIT 1`;
    await this.pool.execute(sql, [user_id, friend_id]);
    await this.pool.execute(sql, [friend_id, user_id]);
  }

  async block({ user_id, friend_id }: FriendParams) {
    const sql1 = `DELETE FROM friendship WHERE user_id = ? AND friend_id = ? LIMIT 1`;
    await this.pool.execute(sql1, [user_id, friend_id]);
    await this.pool.execute(sql1, [friend_id, user_id]);

    const sql2 = `INSERT INTO friendship (user_id, friend_id, status) VALUES (?, ?, "blocked")`;
    await this.pool.execute(sql2, [user_id, friend_id]);
  }
  
  async unblock(params: FriendParams) {
    const sql = `DELETE FROM friendship WHERE user_id = ? AND friend_id = ? LIMIT 1`;
    await this.pool.execute(sql, params);
  }

  async deleteAllByUserId(user_id: string) {
    const sql1 = `DELETE FROM friendship WHERE user_id = ?`;
    const sql2 = `DELETE FROM friendship WHERE friend_id = ?`;
    await this.pool.execute(sql1, [user_id]);
    await this.pool.execute(sql2, [user_id]);
  }
}

export interface IFriendshipRepo {
  getByFriendId:     (params: FriendParams) => Promise<Friendship>;
  checkIfBlockedBy:  (params: FriendParams) => Promise<Friendship>;
  view:              (user_id: string) =>      Promise<FriendView[]>;
  viewAccepted:      (user_id: string) =>      Promise<FriendView[]>;
  viewPending:       (user_id: string) =>      Promise<FriendView[]>;
  viewBlocked:       (user_id: string) =>      Promise<FriendView[]>;
  insert:            (params: InsertParams) => Promise<void>;
  accept:            (params: FriendParams) => Promise<void>;
  reject:            (params: FriendParams) => Promise<void>;
  delete:            (params: FriendParams) => Promise<void>;
  block:             (params: FriendParams) => Promise<void>;
  unblock:           (params: FriendParams) => Promise<void>;
  deleteAllByUserId: (user_id: string) =>      Promise<void>;
}

type InsertParams = {
  user_id:   string;
  friend_id: string;
  status1:   string;
  status2:   string;
};

type FriendParams = {
  user_id:   string;
  friend_id: string;
};

type Friendship = RowDataPacket & {
  user_id:   string;
  friend_id: string;
  status:    string;
};

type FriendView = RowDataPacket & {
  //user_id:  string;  // ??? why ???
  username: string;
  status:   string;
};
