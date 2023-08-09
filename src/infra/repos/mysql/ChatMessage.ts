import { MySQLRepo } from './MySQL';

export class ChatMessageRepo extends MySQLRepo {
  async insert() {
    const sql = `INSERT INTO chatmessage`;
  }

  //async update() {}  // not needed?

  async delete() {
    const sql = `DELETE FROM chatmessage WHERE`;
  }
}
