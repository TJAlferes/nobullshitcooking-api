import { RedisRepo } from '../../shared/Redis';

export class ChatUserRepo extends RedisRepo implements ChatUserRepoInterface {
  async getByUsername(username: string) {
    const chatuser = await this.client.get(`chatuser:${username}`);
    if (!chatuser) throw new Error("Error finding chatuser");
    return JSON.parse(chatuser);
  }  // SECURITY: Do not send to users, only use within this API

  async insert({ session_id, username, connected, last_active }: InsertParams) {
    await this.delete(username);
    await this.client.hset(`chatuser:${username}`,
      'session_id',  session_id,
      'username',    username,
      'connected',   connected,
      'last_active', last_active
    );
  }

  async update({ session_id, username, connected, last_active }: UpdateParams) {
    await this.client.hset(`chatuser:${username}`,
      'session_id',  session_id,
      'username',    username,
      'connected',   connected,
      'last_active', last_active
    );
  }

  async delete(username: string) {
    await this.client.del(`chatuser:${username}`);
  }
}

export interface ChatUserRepoInterface {
  getByUsername: (username: string) =>     Promise<ChatUserRow>;
  insert:        (params: InsertParams) => void;
  update:        (params: UpdateParams) => void;
  delete:        (username: string) =>     void;
}

type InsertParams = {
  session_id:  string;
  username:    string;
  connected:   string;
  last_active: string;
};

type UpdateParams = InsertParams;

type ChatUserRow = InsertParams;
