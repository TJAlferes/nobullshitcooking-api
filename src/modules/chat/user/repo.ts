import { RedisRepo } from "../../shared/Redis";

export class ChatUserRepo extends RedisRepo implements ChatUserRepoInterface {
  async getByUsername(username: string) {
    const chatuser = await this.client.get(`chatuser:${username}`);
    if (!chatuser) throw new Error("Error finding chatuser");
    return JSON.parse(chatuser);
  }  // SECURITY: Do not send to users, only use within this API

  async insert({ username, session_id, last_active }: InsertParams) {
    await this.delete(username);
    await this.client.hset(`chatuser:${username}`, 'session_id', session_id, 'last_active', last_active);
  }

  async update({ username, session_id, last_active }: UpdateParams) {
    await this.client.hset(`chatuser:${username}`, 'session_id', session_id, 'last_active', last_active);
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
  username:    string;
  session_id:  string;
  last_active: string;
};

type UpdateParams = InsertParams;

type ChatUserRow = {
  session_id:  string;
  last_active: string;
};
