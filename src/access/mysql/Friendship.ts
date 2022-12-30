import { Pool, RowDataPacket } from 'mysql2/promise';

export class Friendship implements IFriendship {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.getByFriendId =     this.getByFriendId.bind(this);
    this.checkIfBlockedBy =  this.checkIfBlockedBy.bind(this);
    this.view =              this.view.bind(this);
    this.viewAccepted =      this.viewAccepted.bind(this);
    this.viewPending =       this.viewPending.bind(this);
    this.viewBlocked =       this.viewBlocked.bind(this);
    this.create =            this.create.bind(this);
    this.accept =            this.accept.bind(this);
    this.reject =            this.reject.bind(this);
    this.delete =            this.delete.bind(this);
    this.block =             this.block.bind(this);
    this.unblock =           this.unblock.bind(this);
    this.deleteAllByUserId = this.deleteAllByUserId.bind(this);
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

  async getByFriendId(userId: number, friendId: number) {
    const sql = `SELECT user_id, friend_id, status FROM friendships WHERE user_id = ? AND friend_id = ?`;
    const [ [ row ] ] = await this.pool.execute<RowDataPacket[]>(sql, [userId, friendId]);
    return row;
  }

  async checkIfBlockedBy(userId: number, friendId: number) {
    const sql = `SELECT user_id, friend_id FROM friendships WHERE user_id = ? AND friend_id = ? AND status = "blocked"`;
    const [ [ row ] ] = await this.pool.execute<RowDataPacket[]>(sql, [friendId, userId]);
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
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [userId]);
    return rows;
  }

  async viewAccepted(userId: number) {
    const sql = `
      SELECT u.id AS user_id, u.username f.status
      FROM users u
      INNER JOIN friendships f ON u.id = f.friend_id
      WHERE f.user_id = ? AND f.status = "accepted"
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [userId]);
    return rows;
  }

  async viewPending(userId: number) {
    const sql = `
      SELECT u.id AS user_id, u.username f.status
      FROM users u
      INNER JOIN friendships f ON u.id = f.friend_id
      WHERE f.user_id = ? AND f.status = "pending-received"
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [userId]);
    return rows;
  }

  async viewBlocked(userId: number) {
    const sql = `
      SELECT u.id AS user_id, u.username f.status
      FROM users u
      INNER JOIN friendships f ON u.id = f.friend_id
      WHERE f.user_id = ? AND f.status = "blocked"
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [userId]);
    return rows;
  }

  async create({ userId, friendId, status1, status2 }: ICreatingFriendship) {
    const sql = `INSERT INTO friendships (user_id, friend_id, status) VALUES (?, ?, ?)`;
    const [ [ row ] ] = await this.pool.execute<RowDataPacket[]>(sql, [userId, friendId, status1]);
    await this.pool.execute<RowDataPacket[]>(sql, [friendId, userId, status2]);
    return row;
  }

  async accept(userId: number, friendId: number) {
    const sql1 = `UPDATE friendships SET status = "accepted" WHERE user_id = ? AND friend_id = ? AND status = "pending-received" LIMIT 1`;
    const sql2 = `UPDATE friendships SET status = "accepted" WHERE user_id = ? AND friend_id = ? AND status = "pending-sent" LIMIT 1`;
    const [ [ row ] ] = await this.pool.execute<RowDataPacket[]>(sql1, [userId, friendId]);
    await this.pool.execute<RowDataPacket[]>(sql2, [friendId, userId]);
    return row;
  }

  async reject(userId: number, friendId: number) {
    const sql = `DELETE FROM friendships WHERE user_id = ? AND friend_id = ? AND status != "blocked" LIMIT 1`;
    const [ [ row ] ] = await this.pool.execute<RowDataPacket[]>(sql, [userId, friendId]);
    await this.pool.execute<RowDataPacket[]>(sql, [friendId, userId]);
    return row;
  }

  async delete(userId: number, friendId: number) {
    const sql = `DELETE FROM friendships WHERE user_id = ? AND friend_id = ? AND status != "blocked" LIMIT 1`;
    const [ [ row ] ] = await this.pool.execute<RowDataPacket[]>(sql, [userId, friendId]);
    await this.pool.execute<RowDataPacket[]>(sql, [friendId, userId]);
    return row;
  }

  async block(userId: number, friendId: number) {
    const sql1 = `DELETE FROM friendships WHERE user_id = ? AND friend_id = ? LIMIT 1`;
    const sql2 = `INSERT INTO friendships (user_id, friend_id, status) VALUES (?, ?, "blocked")`;
    await this.pool.execute(sql1, [userId, friendId]);
    await this.pool.execute(sql1, [friendId, userId]);
    const [ [ row ] ] = await this.pool.execute<RowDataPacket[]>(sql2, [userId, friendId]);
    return row;
  }
  
  async unblock(userId: number, friendId: number) {
    const sql = `DELETE FROM friendships WHERE user_id = ? AND friend_id = ? LIMIT 1`;
    const [ [ row ] ] = await this.pool.execute<RowDataPacket[]>(sql, [userId, friendId]);
    return row;
  }

  async deleteAllByUserId(userId: number) {
    const sql1 = `DELETE FROM friendships WHERE user_id = ?`;
    const sql2 = `DELETE FROM friendships WHERE friend_id = ?`;
    await this.pool.execute<RowDataPacket[]>(sql1, [userId]);
    await this.pool.execute<RowDataPacket[]>(sql2, [userId]);
  }
}

type Row = Promise<RowDataPacket>;
type Rows = Promise<RowDataPacket[]>;

export interface IFriendship {
  pool: Pool;
  getByFriendId(userId: number, friendId: number): Row;
  checkIfBlockedBy(userId: number, friendId: number): Row;
  view(userId: number): Rows;
  viewAccepted(userId: number): Rows;
  viewPending(userId: number): Rows;
  viewBlocked(userId: number): Rows;
  create(friendship: ICreatingFriendship): Row;
  accept(userId: number, friendId: number): Row;
  reject(userId: number, friendId: number): Row;
  delete(userId: number, friendId: number): Row;
  block(userId: number, friendId: number): Row;
  unblock(userId: number, friendId: number): Row;
  deleteAllByUserId(userId: number): void;
}

interface ICreatingFriendship {
  userId: number;
  friendId: number;
  status1: string;
  status2: string;
}