import { Redis } from 'ioredis';

export class ChatRoom implements IChatRoom {
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
    // but change to userIds now
    const usernames = await this.pubClient.zrange(`rooms:${room}`, 0, -1);
    const pubClient = this.pubClient;
    let users = [];

    // but change to userId of userIds now
    // or... don't use userIds... and just omit this part?
    for (const username of usernames){
      const userHash = await pubClient.hgetall(`user:${username}`);
      users.push(userHash.username);
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

export interface IChatRoom {
  pubClient: Redis;
  subClient: Redis;
  add(room: string): void;
  getUsers(room: string): Promise<string[]>;
  addUser(username: string, room: string): void;
  removeUser(username: string, room: string): void;
}