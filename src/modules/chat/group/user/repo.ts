import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from '../../../shared/MySQL';

export class ChatgroupUserRepo extends MySQLRepo implements ChatgroupUserRepoInterface {
  async insert(params: InsertParams) {
    const sql = `
      INSERT INTO chatgroup_user (chatgroup_id, user_id)
      VALUES (:chatgroup_id, :user_id)
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, params);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async update(params: UpdateParams) {
    const sql = `
      UPDATE chatgroup_user
      SET
        is_admin = :is_admin,
        is_muted = :is_muted
      WHERE chatgroup_id = :chatgroup_id AND user_id = :user_id
      LIMIT 1
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, params);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async deleteByChatgroupId(chatgroup_id: string) {
    const sql = `DELETE FROM chatgroup_user WHERE chatgroup_id = ? LIMIT 1`;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, [chatgroup_id]);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async deleteByUserId(user_id: string) {
    const sql = `DELETE FROM chatgroup_user WHERE user_id = ? LIMIT 1`;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, [user_id]);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }
}

export interface ChatgroupUserRepoInterface {
  insert:              (params: InsertParams) => Promise<void>;
  update:              (params: UpdateParams) => Promise<void>;
  deleteByChatgroupId: (chatgroup_id: string) => Promise<void>;
  deleteByUserId:      (user_id: string) =>      Promise<void>;
}

type InsertParams = {
  chatgroup_id: string;
  user_id:      string;
};

type UpdateParams = InsertParams & {
  is_admin: boolean;
  is_muted: boolean;
};
