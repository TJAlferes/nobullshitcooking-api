import { Redis } from 'ioredis';

export class MessengerUser implements IMessengerUser {
  client: Redis;

  constructor(client: Redis) {
    this.client = client;
    this.getSocketId = this.getSocketId.bind(this);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
  }

  async getSocketId(id: number) {
    const foundUserSocketId = await this.client.hget(`user:${id}`, 'socketid');
    return foundUserSocketId;
  }

  async add(
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

  async remove(id: number) {
    await this.client
    .multi()
    .zrem('users', id)
    .del(`user:${id}`)
    .exec();
  }
}

export interface IMessengerUser {
  client: Redis;
  getSocketId(id: number): Promise<string|null>;
  add(
    id: number,
    username: string,
    avatar: string,
    sid: string,
    socketid: string
  ): void;
  remove(id: number): void;
}