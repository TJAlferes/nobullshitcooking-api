import { Redis } from 'ioredis';

import { ChatUser } from '../../chat/entities/ChatUser';
import { IChatUser } from '../../chat/entities/types';

export class MessengerRoom implements IMessengerRoom {
  pubClient: Redis;
  subClient: Redis;

  constructor(pubClient: Redis, subClient: Redis) {
    this.pubClient = pubClient;
    this.subClient = subClient;
    this.add = this.add.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.addUser = this.addUser.bind(this);
    this.removeUser = this.removeUser.bind(this);
  }

  async add(room: string) {
    if (room !== '') await this.pubClient.zadd('rooms', `${Date.now()}`, room);
  }

  async getUsers(room: string) {
    const data = await this.pubClient.zrange(`rooms:${room}`, 0, -1);
    const pubClient = this.pubClient;
    let users = [];

    // TO DO: do some renaming here
    for (let username of data){
      const userHash = await pubClient.hgetall(`user:${username}`);
      users.push(ChatUser(userHash.username, userHash.avatar));
    }
    
    return users;
  }
  
  async addUser(username: string, room: string) {
    await this.pubClient
      .multi()
      .zadd(`rooms:${room}`, `${Date.now()}`, `${username}`)
      .set(`user:${username}:room`, room)
      .exec();
  }
  
  async removeUser(username: string, room: string) {
    await this.pubClient
      .multi()
      .zrem(`rooms:${room}`, username)
      .del(`user:${username}:room`)
      .exec();
  }
}

export interface IMessengerRoom {
  pubClient: Redis;
  subClient: Redis;
  add(room: string): void;
  getUsers(room: string): Promise<IChatUser[]>;
  addUser(username: string, room: string): void;
  removeUser(username: string, room: string): void;
}