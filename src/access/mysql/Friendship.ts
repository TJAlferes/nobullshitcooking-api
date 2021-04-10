import { Pool, RowDataPacket } from 'mysql2/promise';

export class Friendship implements IFriendship {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.getByFriendId = this.getByFriendId.bind(this);
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

  async getByFriendId(userId: string, friendId: string) {
    const sql = `
      SELECT userId, friendId, status
      FROM friendships
      WHERE userId = ? AND friendId = ?
    `;
    const [ row ] =
      await this.pool.execute<RowDataPacket[]>(sql, [userId, friendId]);
    return row;
  }

  async checkIfBlockedBy(userId: string, friendId: string) {
    const sql = `
      SELECT userId, friendId
      FROM friendships
      WHERE userId = ? AND friendId = ? AND status = "blocked"
    `;
    const [ rows ] =
      await this.pool.execute<RowDataPacket[]>(sql, [friendId, userId]);
    return rows;
  }

  // change
  async view(userId: string) {
    const sql = `
      SELECT u.username, f.status
      FROM users u
      INNER JOIN friendships f ON u.username = f.friendId
      WHERE
        f.userId = ? AND
        f.status IN ("accepted", "pending-received", "blocked")
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [userId]);
    return rows;
  }

  async viewAccepted(userId: string) {
    const sql = `
      SELECT u.username, f.status
      FROM users u
      INNER JOIN friendships f ON u.username = f.friendId
      WHERE f.userId = ? AND f.status = "accepted"
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [userId]);
    return rows;
  }

  async viewPending(userId: string) {
    const sql = `
      SELECT u.username, f.status
      FROM users u
      INNER JOIN friendships f ON u.username = f.friendId
      WHERE f.userId = ? AND f.status = "pending-received"
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [userId]);
    return rows;
  }

  async viewBlocked(userId: string) {
    const sql = `
      SELECT u.username, f.status
      FROM users u
      INNER JOIN friendships f ON u.username = f.friendId
      WHERE f.userId = ? AND f.status = "blocked"
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [userId]);
    return rows;
  }

  async create({ userId, friendId, status1, status2 }: ICreatingFriendship) {
    const sql =
      `INSERT INTO friendships (userId, friendId, status) VALUES (?, ?, ?)`;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [userId, friendId, status1]);
    await this.pool.execute<RowDataPacket[]>(sql, [friendId, userId, status2]);
    return row;
  }

  async accept(userId: string, friendId: string) {
    const sql1 = `
      UPDATE friendships
      SET status = "accepted"
      WHERE userId = ? AND friendId = ? AND status = "pending-received"
      LIMIT 1
    `;
    const sql2 = `
      UPDATE friendships
      SET status = "accepted"
      WHERE userId = ? AND friendId = ? AND status = "pending-sent"
      LIMIT 1
    `;
    const [ row ] =
      await this.pool.execute<RowDataPacket[]>(sql1, [userId, friendId]);
    await this.pool.execute<RowDataPacket[]>(sql2, [friendId, userId]);
    return row;
  }

  async reject(userId: string, friendId: string) {
    const sql = `
      DELETE
      FROM friendships
      WHERE userId = ? AND friendId = ? AND status != "blocked"
      LIMIT 1
    `;
    const [ row ] =
      await this.pool.execute<RowDataPacket[]>(sql, [userId, friendId]);
    await this.pool.execute<RowDataPacket[]>(sql, [friendId, userId]);
    return row;
  }

  async delete(userId: string, friendId: string) {
    const sql = `
      DELETE
      FROM friendships
      WHERE userId = ? AND friendId = ? AND status != "blocked"
      LIMIT 1
    `;
    const [ row ] =
      await this.pool.execute<RowDataPacket[]>(sql, [userId, friendId]);
    await this.pool.execute<RowDataPacket[]>(sql, [friendId, userId]);
    return row;
  }

  async block(userId: string, friendId: string) {
    const sql1 =
      `DELETE FROM friendships WHERE userId = ? AND friendId = ? LIMIT 1`;
    const sql2 = `
      INSERT INTO friendships (userId, friendId, status)
      VALUES (?, ?, "blocked")
    `;
    await this.pool.execute(sql1, [userId, friendId]);
    await this.pool.execute(sql1, [friendId, userId]);
    const [ row ] =
      await this.pool.execute<RowDataPacket[]>(sql2, [userId, friendId]);
    return row;
  }
  
  async unblock(userId: string, friendId: string) {
    const sql =
      `DELETE FROM friendships WHERE userId = ? AND friendId = ? LIMIT 1`;
    const [ row ] =
      await this.pool.execute<RowDataPacket[]>(sql, [userId, friendId]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IFriendship {
  pool: Pool;
  getByFriendId(userId: string, friendId: string): Data;
  checkIfBlockedBy(userId: string, friendId: string): Data;
  view(userId: string): Data;
  viewAccepted(userId: string): Data;
  viewPending(userId: string): Data;
  viewBlocked(userId: string): Data;
  create({userId, friendId, status1, status2}: ICreatingFriendship): Data;
  accept(userId: string, friendId: string): Data;
  reject(userId: string, friendId: string): Data;
  delete(userId: string, friendId: string): Data;
  block(userId: string, friendId: string): Data;
  unblock(userId: string, friendId: string): Data;
}

interface ICreatingFriendship {
  userId: string;
  friendId: string;
  status1: string;
  status2: string;
}