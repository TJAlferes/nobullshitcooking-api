import { MySQLRepo } from './MySQL';

export class ChatRoomRepo extends MySQLRepo {
  async insert() {
    const sql = `INSERT INTO chatroom`;
  }

  async update() {
    const sql = `UPDATE chatroom SET`;
  }

  async delete() {
    const sql = `DELETE FROM chatroom WHERE`;
  }
}
