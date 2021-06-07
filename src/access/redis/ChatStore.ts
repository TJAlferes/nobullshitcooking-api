import { Redis } from 'ioredis';

import { IMessage } from '../../chat/entities/types';

export class ChatStore implements IChatStore {
  client: Redis;

  constructor(client: Redis) {
    this.client = client;
    this.getUsersInRoom = this.getUsersInRoom.bind(this);
    this.getUserSocketId = this.getUserSocketId.bind(this);
    //this.getRooms
    //this.getMessages
    this.createUser = this.createUser.bind(this);
    this.createRoom = this.createRoom.bind(this);
    this.createMessage = this.createMessage.bind(this);
    this.addUserToRoom = this.addUserToRoom.bind(this);
    this.removeUserFromRoom = this.removeUserFromRoom.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  async getUsersInRoom(room: string) {
    const ids = await this.client.zrange(`rooms:${room}:users`, 0, -1);
    const client = this.client;
    const users = [];
    for (const id of ids){
      const username = await client.hget(`user:${id}`, 'username');
      if (!username) continue;
      users.push(username);
    }
    return users;
  }

  async getUserSocketId(id: number) {
    const socketId = await this.client.hget(`user:${id}`, 'socketId');
    return socketId;
  }

  //async getRooms(cb) {}

  //async getMessages(room: string, cb) {}

  async createUser({ id, username, sessionId, socketId }: ICreatingChatUser) {
    await this.client.multi()
      .hset(
        `user:${id}`,
        'username', username, 'sessionId', sessionId, 'socketId', socketId
      )
      .zadd('users', Date.now(), `${id}`)
      .exec();
  }

  async createRoom(room: string) {  // not needed?
    if (room !== '') await this.client.zadd('rooms', Date.now(), room);
  }

  async createMessage(message: IMessage) {
    await this.client.multi()
      .zadd(`rooms:${message.to}:messages`, JSON.stringify(message))
      .zadd('users', Date.now(), `${message.from.id}`)
      .zadd('rooms', Date.now(), `${message.to}`)
      .exec();
  }
  
  async addUserToRoom(id: number, room: string) {
    await this.client.multi()
      .zadd(`rooms:${room}:users`, Date.now(), `${id}`)
      .zadd('users', Date.now(), `${id}`)
      .zadd('rooms', Date.now(), room)
      .set(`user:${id}:room`, room)
      .exec();
  }
  
  async removeUserFromRoom(id: number, room: string) {
    await this.client.multi()
      .zrem(`rooms:${room}:users`, `${id}`)
      .del(`user:${id}:room`)
      .exec();
  }

  async deleteUser(id: number) {
    await this.client.del(`user:${id}`);
  }
}

export interface IChatStore {
  client: Redis;
  getUsersInRoom(room: string): Promise<string[]>;
  getUserSocketId(id: number): Promise<string | null>;
  //getRooms
  //getMessages
  createUser(userInfo: ICreatingChatUser): void;
  createRoom(room: string): void;
  createMessage(message: IMessage): void;
  addUserToRoom(id: number, room: string): void;
  removeUserFromRoom(id: number, room: string): void;
  deleteUser(id: number): void;
}

interface ICreatingChatUser {
  id: number;
  username: string;
  sessionId: string;
  socketId: string;
}