import { Redis } from 'ioredis';

import { IChatUser, IMessage } from '../../chat/entities/types';

const TTL = 24 * 60 * 60;

export class ChatStore implements IChatStore {
  client: Redis;

  constructor(client: Redis) {
    this.client = client;
    this.createRoom = this.createRoom.bind(this);
    this.getUsersInRoom = this.getUsersInRoom.bind(this);
    this.addUserToRoom = this.addUserToRoom.bind(this);
    this.removeUserFromRoom = this.removeUserFromRoom.bind(this);
    this.getUserSocketId = this.getUserSocketId.bind(this);
    this.createUser = this.createUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.createMessage = this.createMessage.bind(this);
  }

  // not needed?  you'd still need part of the worker...
  async createRoom(room: string) {
    if (room !== '') await this.client.zadd('rooms', `${Date.now()}`, room);
  }

  //async getMessages(room: string) {}

  async getUsersInRoom(room: string) {
    const ids = await this.client.zrange(`rooms:${room}:users`, 0, -1);
    const client = this.client;
    const users = [];
    for (const id of ids){
      const username = await client.hget(`user:${id}`, 'username');
      if (!username) continue;
      users.push({id: Number(id), username});
    }
    return users;
  }
  
  async addUserToRoom(id: number, room: string) {
    await this.client
      .multi()
      .zadd(`rooms:${room}:users`, `${Date.now()}`, `${id}`)
      .set(`user:${id}:room`, room)
      .exec();
  }
  
  async removeUserFromRoom(id: number, room: string) {
    await this.client
      .multi()
      .zrem(`rooms:${room}:users`, id)
      .del(`user:${id}:room`)
      .exec();
  }

  async getUserSocketId(id: number) {
    const socketId = await this.client.hget(`user:${id}`, 'socketid');
    return socketId;
  }

  async createUser({ id, username, sessionId, socketId }: ICreatingChatUser) {
    await this.client
      .multi()
      .hset(
        `user:${id}`,
        'username', username, 'sessionId', sessionId, 'socketId', socketId
      )
      //.zadd('users', `${Date.now()}`, `${id}`)
      .expire(`user:${id}`, TTL)
      //.expire('users')
      .exec();
  }

  async deleteUser(id: number) {
    await this.client.del(`user:${id}`);
  }

  async createMessage(message: IMessage) {
    await this.client
      .multi()
      .zadd(`rooms:${message.to}:messages`, JSON.stringify(message))
      .expire(`rooms:${message.to}:messages`, TTL)
      //.zadd('rooms', `${(new Date).getTime()}`, JSON.stringify(chat.room))
      .exec();
  }
}

export interface IChatStore {
  client: Redis;
  createRoom(room: string): void;
  getUsersInRoom(room: string): Promise<IChatUser[]>;
  addUserToRoom(id: number, room: string): void;
  removeUserFromRoom(id: number, room: string): void;
  getUserSocketId(id: number): Promise<string | null>;
  createUser(userInfo: ICreatingChatUser): void;
  deleteUser(id: number): void;
  createMessage(message: IMessage): void;
}

interface ICreatingChatUser {
  id: number;
  username: string;
  sessionId: string;
  socketId: string;
}