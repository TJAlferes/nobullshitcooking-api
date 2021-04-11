import { Redis } from 'ioredis';

export class ChatUser implements IChatUser {
  client: Redis;

  constructor(client: Redis) {
    this.client = client;
    this.getSocketId = this.getSocketId.bind(this);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
  }

  async getSocketId(id: string) {
    const foundUserSocketId = await this.client.hget(`user:${id}`, 'socketid');
    return foundUserSocketId;
  }

  async add(username: string, sid: string, socketid: string) {
    await this.client
      .multi()
      .hset(`user:${username}`, 'username', username)
      .hset(`user:${username}`, 'sid', sid)
      .hset(`user:${username}`, 'socketid', socketid)
      .zadd('users', `${Date.now()}`, `${username}`)
      .exec();
  }

  async remove(username: string) {
    await this.client
      .multi()
      .zrem('users', username)
      .del(`user:${username}`)
      .exec();
  }
}

export interface IChatUser {
  client: Redis;
  getSocketId(id: string): Promise<string|null>;
  add(username: string, sid: string, socketid: string): void;
  remove(username: string): void;
}