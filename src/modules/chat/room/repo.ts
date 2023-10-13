import { RowDataPacket } from "mysql2";

import { MySQLRepo } from "../../shared/MySQL.js";

export class ChatroomRepo extends MySQLRepo implements ChatroomRepoInterface {
  async overviewAllByChatgroupId(chatgroup_id: string) {
    const sql = `
      SELECT
        chatroom_id,
        chatroom_name
      FROM chatroom
      WHERE chatgroup_id = :chatgroup_id
    `;
    const [ rows ] = await this.pool.execute<ChatroomOverview[]>(sql, chatgroup_id);
    return rows;
  }

  async viewByChatroomName(chatroom_name: string) {
    const sql = `SELECT chatroom_id FROM chatroom WHERE chatroom_name = ?`;
    const [ [ row ] ] = await this.pool.execute<ChatroomId[]>(sql, chatroom_name);
    return row.chatroom_id;
  }

  async insert(params: InsertParams) {
    const sql = `
      INSERT INTO chatroom (
        chatroom_id,
        chatgroup_id,
        chatroom_name
      ) VALUES (
        :chatroom_id,
        :chatgroup_id,
        :chatroom_name
      )
    `;
    await this.pool.execute(sql, params);
  }

  async update({ chatroom_name, chatroom_id }: UpdateParams) {
    const sql = `
      UPDATE chatroom
      SET
        chatroom_name = :chatroom_name
      WHERE chatroom_id = :chatroom_id
      LIMIT 1
    `;
    await this.pool.execute(sql, {
      chatroom_name,
      chatroom_id
    });
  }

  async deleteOne(chatroom_id: string) {
    const sql = `
      DELETE FROM chatroom
      WHERE chatroom_id = :chatroom_id
      LIMIT 1
    `;
    await this.pool.execute(sql, chatroom_id);
  }
}

export interface ChatroomRepoInterface {
  overviewAllByChatgroupId: (chatgroup_id: string) => Promise<ChatroomOverview[]>;
  viewByChatroomName:       (chatroom_name: string) => Promise<string>
  insert:                   (params: InsertParams) => Promise<void>;
  update:                   (params: UpdateParams) => Promise<void>;
  deleteOne:                (chatroom_id: string) =>  Promise<void>;
}

type ChatroomOverview = RowDataPacket & {
  chatroom_id:   string;
  chatroom_name: string;
};

type ChatroomId = RowDataPacket & {
  chatroom_id: string;
};

type InsertParams = {
  chatroom_id:   string;
  chatgroup_id:  string;
  chatroom_name: string;
};

type UpdateParams = {
  chatroom_id:   string;
  chatroom_name: string;
};
