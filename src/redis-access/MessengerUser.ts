import { Redis } from 'ioredis';

export class MessengerUser implements IMessengerUser {
  client: Redis;

  constructor(client: Redis) {
    this.client = client;
    this.getUserSocketId = this.getUserSocketId.bind(this);
    this.addUser = this.addUser.bind(this);
    this.removeUser = this.removeUser.bind(this);
  }

  async getUserSocketId(userId: number) {
    const foundUserSocketId = await this.client
    .hget(`user:${userId}`, 'socketid');
    //if (!foundUserSocketId) throw ?
    return foundUserSocketId;
  }

  async addUser(
    userId: number,
    username: string,
    avatar: string,
    sid: string,
    socketid: string
  ) {
    await this.client
    .multi()
    .hset(`user:${userId}`, 'username', username)
    .hset(`user:${userId}`, 'avatar', avatar)
    .hset(`user:${userId}`, 'sid', sid)
    .hset(`user:${userId}`, 'socketid', socketid)
    .zadd('users', `${Date.now()}`, `${userId}`)
    .exec();
  }

  async removeUser(userId: number) {
    await this.client
    .multi()
    .zrem('users', userId)
    .del(`user:${userId}`)
    .exec();
  }
}

export interface IMessengerUser {
  client: Redis;
  getUserSocketId(userId: number): Promise<string|null>;
  addUser(
    userId: number,
    username: string,
    avatar: string,
    sid: string,
    socketid: string
  ): void;
  removeUser(userId: number): void;
}