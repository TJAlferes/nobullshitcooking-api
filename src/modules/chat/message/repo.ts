import { ResultSetHeader, RowDataPacket } from "mysql2";

import { MySQLRepo } from "../../shared/MySQL";

export class ChatmessageRepo extends MySQLRepo implements ChatmessageRepoInterface {
  async viewByChatroomId(chatroom_id: string) {
    const sql = `
      SELECT
        cm.chatmessage_id,
        cm.sender_id,
        u.username,
        cm.content,
        cm.created_at
      FROM chatmessage cm
      INNER JOIN user u ON u.user_id = cm.sender_id
      WHERE cm.chatroom_id = ?
    `;
    const [ rows ] = await this.pool.execute<ChatmessageView[]>(sql, chatroom_id);
    return rows;
  }

  async viewPrivateConversation({ sender_id, receiver_id }: ViewPrivateConversationParams) {
    const sql = `
      SELECT
        cm.chatmessage_id,
        cm.sender_id,
        u.username,
        cm.content,
        cm.created_at
      FROM chatmessage cm
      INNER JOIN user u ON u.user_id = cm.sender_id
      WHERE
        (cm.sender_id = ? AND cm.receiver_id = ?) OR
        (cm.sender_id = ? AND cm.receiver_id = ?)
    `;
    const [ rows ] = await this.pool.execute<ChatmessageView[]>(sql, [
      sender_id,
      receiver_id,
      receiver_id,
      sender_id
    ]);
    return rows;
  }

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
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, params);
    if (!result) throw new Error('Query not successful.');
  }

  async delete(chatmessage_id: string) {
    const sql = `DELETE FROM chatmessage WHERE chatmessage_id = ? LIMIT 1`;
    await this.pool.execute(sql, [chatmessage_id]);
  }
}

interface ChatmessageRepoInterface {
  viewByChatroomId:        (chatroom_id: string) =>                   Promise<ChatmessageView[]>;
  viewPrivateConversation: (params: ViewPrivateConversationParams) => Promise<ChatmessageView[]>;
  insert:                  (params: InsertParams) =>                  Promise<void>;
  delete:                  (chatmessage_id: string) =>                Promise<void>;  // and owner_id ???
}

export type ChatmessageView = RowDataPacket & {
  chatmessage_id: string;
  chatroom_id:    string;
  sender_id:      string;
  username:       string;
  content:        string;
  created_at:     string;
};

export type PrivateChatmessageView = RowDataPacket & {
  chatmessage_id: string;
  receiver_id:    string;
  sender_id:      string;
  username:       string;
  content:        string;
  created_at:     string;
};

type ViewPrivateConversationParams = {
  sender_id:   string;
  receiver_id: string;
};

type InsertParams = {
  chatmessage_id: string;
  chatroom_id:    string | null;
  sender_id:      string;
  receiver_id:    string | null;
  content:        string;
  //image_id:       string;
  //video_id:       string;
};
