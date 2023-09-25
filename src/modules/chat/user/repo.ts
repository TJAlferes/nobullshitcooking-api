import { RedisRepo } from "../../shared/Redis";

export class ChatUserRepo extends RedisRepo implements ChatUserRepoInterface {
  async getSessionId(username: string) {
    const session_id = await this.client.hget(`chatuser:${username}`, 'session_id');
    return session_id;
  }  // SECURITY: Do not send session_id to users, only use within this API

  async insert({ session_id, username }: InsertParams) {
    await this.delete(username);
    await this.client.hset(`chatuser:${username}`, 'session_id', session_id);
  }

  async delete(username: string) {
    await this.client.del(`chatuser:${username}`);
  }
}

export interface ChatUserRepoInterface {
  getSessionId(username: string): Promise<string | null>;
  insert(params: InsertParams):   void;
  delete(username: string):       void;
}

type InsertParams = {
  session_id: string;
  username:   string;
};
