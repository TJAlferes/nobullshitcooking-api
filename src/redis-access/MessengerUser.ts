import { Redis } from 'ioredis';

export class MessengerUser implements IMessengerUser {
  client: Redis;

  constructor(client: Redis) {
    this.client = client;
    this.getUserSocketId = this.getUserSocketId.bind(this);
    this.addUser = this.addUser.bind(this);
    this.removeUser = this.removeUser.bind(this);
  }

  async getUserSocketId(id: number) {
    const foundUserSocketId = await this.client.hget(`user:${id}`, 'socketid');
    return foundUserSocketId;
  }

  async addUser(
    id: number,
    username: string,
    avatar: string,
    sid: string,
    socketid: string
  ) {
    await this.client
    .multi()
    .hset(`user:${id}`, 'username', username)
    .hset(`user:${id}`, 'avatar', avatar)
    .hset(`user:${id}`, 'sid', sid)
    .hset(`user:${id}`, 'socketid', socketid)
    .zadd('users', `${Date.now()}`, `${id}`)
    .exec();
  }

  async removeUser(id: number) {
    await this.client
    .multi()
    .zrem('users', id)
    .del(`user:${id}`)
    .exec();
  }
}

export interface IMessengerUser {
  client: Redis;
  getUserSocketId(id: number): Promise<string|null>;
  addUser(
    id: number,
    username: string,
    avatar: string,
    sid: string,
    socketid: string
  ): void;
  removeUser(id: number): void;
}