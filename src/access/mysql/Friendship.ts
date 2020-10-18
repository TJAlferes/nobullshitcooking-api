import { Pool, RowDataPacket } from 'mysql2/promise';

export class Friendship implements IFriendship {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.getByFriend = this.getByFriend.bind(this);
    this.checkIfBlockedBy = this.checkIfBlockedBy.bind(this);
    this.view = this.view.bind(this);
    this.viewAccepted = this.viewAccepted.bind(this);
    this.viewPending = this.viewPending.bind(this);
    this.viewBlocked = this.viewBlocked.bind(this);
    this.create = this.create.bind(this);
    this.accept = this.accept.bind(this);
    this.reject = this.reject.bind(this);
    this.delete = this.delete.bind(this);
    this.block = this.block.bind(this);
    this.unblock = this.unblock.bind(this);
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
  (again, except for block/unblock, which must be one-sided)

  */

  async getByFriend(user: string, friend: string) {
    const sql = `
      SELECT user, friend, status FROM friendships WHERE user = ? AND friend = ?
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [user, friend]);
    return row;
  }

  async checkIfBlockedBy(user: string, friend: string) {
    const sql = `
      SELECT user, friend
      FROM friendships
      WHERE user = ? AND friend = ? AND status = "blocked"
    `;
    const [ rows ] = await this.pool
      .execute<RowDataPacket[]>(sql, [friend, user]);
    return rows;
  }

  // change
  async view(user: string) {
    const sql = `
      SELECT u.username, u.avatar, f.status
      FROM users u
      INNER JOIN friendships f ON u.username = f.friend
      WHERE
        f.user = ? AND
        f.status IN ("accepted", "pending-received", "blocked")
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [user]);
    return rows;
  }

  async viewAccepted(user: string) {
    const sql = `
      SELECT u.username, u.avatar, f.status
      FROM users u
      INNER JOIN friendships f ON u.username = f.friend
      WHERE f.user = ? AND f.status = "accepted"
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [user]);
    return rows;
  }

  async viewPending(user: string) {
    const sql = `
      SELECT u.username, u.avatar, f.status
      FROM users u
      INNER JOIN friendships f ON u.username = f.friend
      WHERE f.user = ? AND f.status = "pending-received"
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [user]);
    return rows;
  }

  async viewBlocked(user: string) {
    const sql = `
      SELECT u.username, u.avatar, f.status
      FROM users u
      INNER JOIN friendships f ON u.username = f.friend
      WHERE f.user = ? AND f.status = "blocked"
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [user]);
    return rows;
  }

  async create({ user, friend, status1, status2 }: ICreatingFriendship) {
    const sql = `
      INSERT INTO friendships (user, friend, status) VALUES (?, ?, ?)
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [user, friend, status1]);
    await this.pool.execute<RowDataPacket[]>(sql, [friend, user, status2]);
    return row;
  }

  async accept(user: string, friend: string) {
    const sql1 = `
      UPDATE friendships
      SET status = "accepted"
      WHERE user = ? AND friend = ? AND status = "pending-received"
      LIMIT 1
    `;
    const sql2 = `
      UPDATE friendships
      SET status = "accepted"
      WHERE user = ? AND friend = ? AND status = "pending-sent"
      LIMIT 1
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql1, [user, friend]);
    await this.pool.execute<RowDataPacket[]>(sql2, [friend, user]);
    return row;
  }

  async reject(user: string, friend: string) {
    const sql = `
      DELETE
      FROM friendships
      WHERE user = ? AND friend = ? AND status != "blocked"
      LIMIT 1
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [user, friend]);
    await this.pool.execute<RowDataPacket[]>(sql, [friend, user]);
    return row;
  }

  async delete(user: string, friend: string) {
    const sql = `
      DELETE
      FROM friendships
      WHERE user = ? AND friend = ? AND status != "blocked"
      LIMIT 1
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [user, friend]);
    await this.pool.execute<RowDataPacket[]>(sql, [friend, user]);
    return row;
  }

  async block(user: string, friend: string) {
    const sql1 = `
      DELETE FROM friendships WHERE user = ? AND friend = ? LIMIT 1
    `;
    const sql2 = `
      INSERT INTO friendships (user, friend, status) VALUES (?, ?, "blocked")
    `;
    await this.pool.execute(sql1, [user, friend]);
    await this.pool.execute(sql1, [friend, user]);
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql2, [user, friend]);
    return row;
  }
  
  async unblock(user: string, friend: string) {
    const sql = `
      DELETE FROM friendships WHERE user = ? AND friend = ? LIMIT 1
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [user, friend]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IFriendship {
  pool: Pool;
  getByFriend(user: string, friend: string): Data;
  checkIfBlockedBy(user: string, friend: string): Data;
  view(user: string): Data;
  viewAccepted(user: string): Data;
  viewPending(user: string): Data;
  viewBlocked(user: string): Data;
  create({user, friend, status1, status2}: ICreatingFriendship): Data;
  accept(user: string, friend: string): Data;
  reject(user: string, friend: string): Data;
  delete(user: string, friend: string): Data;
  block(user: string, friend: string): Data;
  unblock(user: string, friend: string): Data;
}

interface ICreatingFriendship {
  user: string;
  friend: string;
  status1: string;
  status2: string;
}