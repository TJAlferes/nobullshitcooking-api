import { Redis } from 'ioredis';

import { IChatUser, IMessage } from '../../chat/entities/types';

const MESSAGES_TTL = 24 * 60 * 60;

export class RoomStore implements IRoomStore {
  pubClient: Redis;
  subClient: Redis;

  constructor(pubClient: Redis, subClient: Redis) {
    this.pubClient = pubClient;
    this.subClient = subClient;
    this.create = this.create.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.addUser = this.addUser.bind(this);
    this.removeUser = this.removeUser.bind(this);
  }

  // not needed?
  async create(room: string) {
    if (room !== '') await this.pubClient.zadd('rooms', `${Date.now()}`, room);
  }

  //async getMessages(room: string) {}

  async getUsers(room: string) {
    const ids = await this.pubClient.zrange(`rooms:${room}:users`, 0, -1);
    const pubClient = this.pubClient;
    const users = [];
    for (const id of ids){
      const username = await pubClient.hget(`user:${id}`, 'username');
      if (!username) continue;
      users.push({id: Number(id), username});
    }
    return users;
  }

  async addMessage(message: IMessage) {
    await this.pubClient
      .multi()
      .zadd(`rooms:${message.to}:messages`, JSON.stringify(message))
      .expire(`rooms:${message.to}:messages`, MESSAGES_TTL)
      //.zadd('rooms', `${(new Date).getTime()}`, JSON.stringify(chat.room))
      .exec();
  }
  
  async addUser(id: number, room: string) {
    await this.pubClient
      .multi()
      .zadd(`rooms:${room}:users`, `${Date.now()}`, `${id}`)
      .set(`user:${id}:room`, room)
      .exec();
  }
  
  async removeUser(id: number, room: string) {
    await this.pubClient
      .multi()
      .zrem(`rooms:${room}:users`, id)
      .del(`user:${id}:room`)
      .exec();
  }
}

export interface IRoomStore {
  pubClient: Redis;
  subClient: Redis;
  create(room: string): void;
  getUsers(room: string): Promise<IChatUser[]>;
  addUser(id: number, room: string): void;
  removeUser(id: number, room: string): void;
}