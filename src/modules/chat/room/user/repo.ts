import { ResultSetHeader, RowDataPacket } from "mysql2";

import { MySQLRepo } from "../../../shared/MySQL";

export class ChatroomUserRepo extends MySQLRepo implements ChatroomUserRepoInterface {
  //async viewByChatroomId(chatroom_id: string) {}
  
  async insert(params: InsertParams) {
    const sql = `
      INSERT INTO chatroom_user (chatroom_id, user_id)
      VALUES (:chatroom_id, :user_id)
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, params);
    if (!result) throw new Error('Query not successful.');
  }

  async update(params: UpdateParams) {
    const sql = `
      UPDATE chatroom_user
      SET
        is_admin = :is_admin,
        is_muted = :is_muted
      WHERE chatroom_id = :chatroom_id AND user_id = :user_id
      LIMIT 1
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, params);
    if (!result) throw new Error('Query not successful.');
  }

  async deleteByChatroomId(chatroom_id: string) {
    const sql = `DELETE FROM chatroom_user WHERE chatroom_id = ? LIMIT 1`;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, chatroom_id);
    if (!result) throw new Error('Query not successful.');
  }

  async deleteByUserId(user_id: string) {
    const sql = `DELETE FROM chatroom_user WHERE user_id = ? LIMIT 1`;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, user_id);
    if (!result) throw new Error('Query not successful.');
  }
}

export interface ChatroomUserRepoInterface {
  insert:             (params: InsertParams) => Promise<void>;
  update:             (params: UpdateParams) => Promise<void>;
  deleteByChatroomId: (chatroom_id: string) =>  Promise<void>;
  deleteByUserId:     (user_id: string) =>      Promise<void>;
}

type InsertParams = {
  chatroom_id: string;
  user_id:     string;
};

type UpdateParams = InsertParams & {
  is_admin: boolean;
  is_muted: boolean;
};
