import { Redis } from 'ioredis';

import { ChatUser, IChatUser } from '../chat/entities/ChatUser';

export class MessengerRoom implements IMessengerRoom {
  pubClient: Redis;
  subClient: Redis;

  constructor(pubClient: Redis, subClient: Redis) {
    this.pubClient = pubClient;
    this.subClient = subClient;
    this.addRoom = this.addRoom.bind(this);
    this.getUsersInRoom = this.getUsersInRoom.bind(this);
    this.addUserToRoom = this.addUserToRoom.bind(this);
    this.removeUserFromRoom = this.removeUserFromRoom.bind(this);
  }

  async addRoom(room: string) {
    if (room !== '') {
      await this.pubClient.zadd('rooms', `${Date.now()}`, room);
    }
  };

  async getUsersInRoom(room: string) {
    const data = await this.pubClient.zrange(`rooms:${room}`, 0, -1);
    
    const pubClient = this.pubClient;
    let users = [];

    for (let userId of data){
      const userHash = await pubClient.hgetall(`user:${userId}`);
      users
      .push(ChatUser(Number(userId), userHash.username, userHash.avatar));
    }

    return users;
  }
  
  async addUserToRoom(userId: number, room: string) {
    await this.pubClient
    .multi()
    .zadd(`rooms:${room}`, `${Date.now()}`, `${userId}`)
    .set(`user:${userId}:room`, room)
    .exec();
  }
  
  async removeUserFromRoom(userId: number, room: string) {
    await this.pubClient
    .multi()
    .zrem(`rooms:${room}`, userId)
    .del(`user:${userId}:room`)
    .exec();
  };
}

export interface IMessengerRoom {
  pubClient: Redis;
  subClient: Redis;
  addRoom(room: string): void;
  getUsersInRoom(room: string): Promise<IChatUser[]>;
  addUserToRoom(userId: number, room: string): void;
  removeUserFromRoom(userId: number, room: string): void;
}