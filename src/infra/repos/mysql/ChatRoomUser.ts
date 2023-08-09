import { MySQLRepo } from './MySQL';

export class ChatRoomUserRepo extends MySQLRepo {
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

  async delete() {
    const sql = `DELETE FROM chatroom_user WHERE LIMIT 1`;
  }
}
