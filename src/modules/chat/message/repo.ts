import { MySQLRepo } from "../../shared/MySQL";

export class ChatMessageRepo extends MySQLRepo implements IChatMessageRepo {
  async insert(params: InsertParams) {
    const sql = `
      INSERT INTO chatmessage (
        chatmessage_id,
        chatroom_id,
        sender_id,
        receiver_id,
        content
      ) VALUES (
        chatmessage_id = :chatmessage_id,
        chatroom_id =    :chatroom_id,
        sender_id =      :sender_id,
        receiver_id =    :receiver_id,
        content =        :content
      )
    `;
    await this.pool.execute(sql, params);
  }

  async delete(chatmessage_id: string) {
    const sql = `DELETE FROM chatmessage WHERE chatmessage_id = ? LIMIT 1`;
    await this.pool.execute(sql, [chatmessage_id]);
  }
}

interface IChatMessageRepo {
  insert: (params: InsertParams) =>   Promise<void>;
  delete: (chatmessage_id: string) => Promise<void>;  // and owner_id ???
}

type InsertParams = {
  chatmessage_id: string;
  chatroom_id:    string;
  sender_id:      string;
  receiver_id:    string;
  content:        string;
  //image_id:       string;
  //video_id:       string;
};
