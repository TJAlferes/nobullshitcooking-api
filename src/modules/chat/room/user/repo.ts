import { RowDataPacket } from "mysql2";

import { MySQLRepo } from "../../../shared/MySQL";

export class ChatroomUserRepo extends MySQLRepo {
  async insert() {
    const sql = `INSERT INTO chatroom_user (chatroom_id, user_id) VALUES (?, ?)`;
  }

  async update() {
    const sql = `
      UPDATE chatroom_user
      SET
        
      WHERE
      LIMIT 1
    `;
  }

  async deleteOne() {
    const sql = `DELETE FROM chatroom_user WHERE LIMIT 1`;
  }
}
