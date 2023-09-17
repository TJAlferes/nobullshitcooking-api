import { Redis } from 'ioredis';

import { IMessage } from '../../chat';

// TO DO: Don't use Redis for this anymore. Migrate to MySQL.
export class ChatStore implements IChatStore {
  client: Redis;

  constructor(client: Redis) {
    this.client = client;
  }

  async getUsersInRoom(room: string) {
    const users = await this.client.zrange(`rooms:${room}:users`, 0, -1);
    return users;
  }

  async getUserSessionId(username: string) {
    const sessionId = await this.client.hget(`user:${username}`, 'sessionId');
    return sessionId;
  }

  async createUser({ sessionId, username }: IUserInfo) {
    await this.client.multi()
      .hset(`user:${username}`, 'sessionId', sessionId)
      .zadd('users', Date.now(), `${username}`)
      .exec();
  }

  async createRoom(room: string) {
    if (room !== '') await this.client.zadd('rooms', Date.now(), room);
  }

  async createMessage(message: IMessage) {
    await this.client.multi()
      .zadd(`rooms:${message.to}:messages`, JSON.stringify(message))
      .zadd('users',                        Date.now(), `${message.from}`)
      .zadd('rooms',                        Date.now(), `${message.to}`)
      .exec();
  }
  
  async addUserToRoom(username: string, room: string) {
    await this.client.multi()
      .zadd(`rooms:${room}:users`, Date.now(), username)
      .zadd('users',               Date.now(), username)
      .zadd('rooms',               Date.now(), room)
      .set(`user:${username}:room`, room)
      .exec();
  }
  
  async removeUserFromRoom(username: string, room: string) {
    await this.client.multi()
      .zrem(`rooms:${room}:users`, username)
      .del(`user:${username}:room`)
      .exec();
  }

  async deleteUser(username: string) {
    await this.client.del(`user:${username}`);
  }
}

export interface IChatStore {
  client:                                             Redis;
  getUsersInRoom(room: string):                       Promise<string[]>;
  getUserSessionId(username: string):                 Promise<string | null>;
  createUser(userInfo: IUserInfo):                    void;
  createRoom(room: string):                           void;
  createMessage(message: IMessage):                   void;
  addUserToRoom(username: string, room: string):      void;
  removeUserFromRoom(username: string, room: string): void;
  deleteUser(username: string):                       void;
}

interface IUserInfo {
  sessionId: string;
  username:  string;
}
