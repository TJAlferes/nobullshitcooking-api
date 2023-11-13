import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

import { MySQLRepo } from '../../shared/MySQL';

// Each friendship is represented by TWO records in the table:
//
//   user_id: 1, friend_id: 2, status: "pending-sent"
//   user_id: 2, friend_id: 1, status: "pending-received"
//
// Only user 2 can accept (update these records) or reject (delete these records)
//
//   user_id: 1, friend_id: 2, status: "accepted"
//   user_id: 2, friend_id: 1, status: "accepted"
//
// Now either user can unfriend (delete these records)


// Blocking is represented by ONLY ONE record in the table:
//
//   user_id: 1, friend_id: 2, status: "blocked"
//   Here, user 1 blocked user 2 (user 2 is blocked by user 1)

// Only user 1 can unblock (delete this record)


export class FriendshipRepo extends MySQLRepo implements FriendshipRepoInterface {
  async getStatus(params: GetStatusParams): Promise<string | undefined> {
    const sql = `
      SELECT status
      FROM friendship
      WHERE user_id = ? AND friend_id = ?
    `;
    const [ [ row ] ] = await this.pool.execute<StatusData[]>(sql, params);
    return row ? row.status : undefined;
  }

  async viewAll(user_id: string) {
    const sql = `
      SELECT u.username, f.status
      FROM friendship f
      INNER JOIN user u ON u.user_id = f.friend_id
      WHERE
        f.user_id = ?
        AND f.status IN ("accepted", "pending-received", "blocked")
    `;
    const [ rows ] = await this.pool.execute<FriendView[]>(sql, [user_id]);
    return rows;
  }

  async viewAllOfStatus({ user_id, status }: ViewAllOfStatusParams) {
    const sql = `
      SELECT u.username, f.status
      FROM friendship f
      INNER JOIN user u ON u.user_id = f.friend_id
      WHERE f.user_id = ? AND f.status = ?
    `;
    const [ rows ] = await this.pool.execute<FriendView[]>(sql, [user_id, status]);
    return rows;
  }

  async insert({ user_id, friend_id, status }: InsertParams) {
    const sql = `
      INSERT INTO friendship (user_id, friend_id, status)
      VALUES (?, ?, ?)
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, [
      user_id,
      friend_id,
      status
    ]);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async update({ user_id, friend_id, status }: UpdateParams) {
    const sql = `
      UPDATE friendship
      SET status = ?
      WHERE user_id = ? AND friend_id = ?
      LIMIT 1
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, [
      status,
      user_id,
      friend_id
    ]);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async delete({ user_id, friend_id }: DeleteParams) {
    const sql = `
      DELETE FROM friendship
      WHERE user_id = ? AND friend_id = ?
      LIMIT 1
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, [user_id, friend_id]);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }
}

export interface FriendshipRepoInterface {
  getStatus:       (params: GetStatusParams) =>       Promise<string | undefined>;
  viewAll:         (user_id: string) =>               Promise<FriendView[]>;
  viewAllOfStatus: (params: ViewAllOfStatusParams) => Promise<FriendView[]>;
  insert:          (params: InsertParams) =>          Promise<void>;
  update:          (params: UpdateParams) =>          Promise<void>;
  delete:          (params: DeleteParams) =>          Promise<void>;
}

type GetStatusParams = {
  user_id:   string;
  friend_id: string;
};

type ViewAllOfStatusParams = {
  user_id:   string;
  status:    string;
};

type InsertParams = {
  user_id:   string;
  friend_id: string;
  status:    string;
};

type UpdateParams = InsertParams;

type DeleteParams = {
  user_id:   string;
  friend_id: string;
};

type StatusData = RowDataPacket & {
  status: string;
};

type FriendView = RowDataPacket & {
  username: string;
  status:   string;
};
