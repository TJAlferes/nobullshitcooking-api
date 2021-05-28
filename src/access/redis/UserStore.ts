import { Redis } from 'ioredis';

const USER_TTL = 24 * 60 * 60;

export class UserStore implements IUserStore {
  client: Redis;

  constructor(client: Redis) {
    this.client = client;
    this.getSocketId = this.getSocketId.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
  }

  async getSocketId(id: number) {
    const socketId = await this.client.hget(`user:${id}`, 'socketid');
    return socketId;
  }

  async create({ id, username, sessionId, socketId }: ICreatingChatUser) {
    await this.client
      .multi()
      .hset(
        `user:${id}`,
        'username', username, 'sessionId', sessionId, 'socketId', socketId
      )
      //.zadd('users', `${Date.now()}`, `${id}`)
      .expire(`user:${id}`, USER_TTL)
      //.expire('users')
      .exec();
  }

  async delete(id: number) {
    await this.client.del(`user:${id}`);
  }
}

export interface IUserStore {
  client: Redis;
  getSocketId(id: number): Promise<string | null>;
  create(userInfo: ICreatingChatUser): void;
  delete(id: number): void;
}

interface ICreatingChatUser {
  id: number;
  username: string;
  sessionId: string;
  socketId: string;
}