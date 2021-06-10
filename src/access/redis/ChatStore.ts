import { Redis } from 'ioredis';

import { IMessage } from '../../chat';

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
    const users = await this.client.zrange(`rooms:${room}:users`, 0, -1);
    return users;
  }

  async getUserSocketId(username: string) {
    const socketId = await this.client.hget(`user:${username}`, 'socketId');
    return socketId;
  }

  //async getRooms(cb) {}

  //async getMessages(room: string, cb) {}

  async createUser({ username, sessionId, socketId }: ICreatingChatUser) {
    await this.client.multi()
      .hset(`user:${username}`, 'sessionId', sessionId, 'socketId', socketId)
      .zadd('users', Date.now(), `${username}`)
      .exec();
  }

  async createRoom(room: string) {  // not needed?
    if (room !== '') await this.client.zadd('rooms', Date.now(), room);
  }

  async createMessage(message: IMessage) {
    await this.client.multi()
      .zadd(`rooms:${message.to}:messages`, JSON.stringify(message))
      .zadd('users', Date.now(), `${message.from}`)
      .zadd('rooms', Date.now(), `${message.to}`)
      .exec();
  }
  
  async addUserToRoom(username: string, room: string) {
    await this.client.multi()
      .zadd(`rooms:${room}:users`, Date.now(), username)
      .zadd('users', Date.now(), username)
      .zadd('rooms', Date.now(), room)
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
  client: Redis;
  getUsersInRoom(room: string): Promise<string[]>;
  getUserSocketId(username: string): Promise<string | null>;
  //getRooms
  //getMessages
  createUser(userInfo: ICreatingChatUser): void;
  createRoom(room: string): void;
  createMessage(message: IMessage): void;
  addUserToRoom(username: string, room: string): void;
  removeUserFromRoom(username: string, room: string): void;
  deleteUser(username: string): void;
}

interface ICreatingChatUser {
  username: string;
  sessionId: string;
  socketId: string;
}