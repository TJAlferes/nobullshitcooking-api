import { Redis } from 'ioredis';

import { IMessage } from '../../chat/entities/types';

export class ChatMessage implements IChatMessage {
  client: Redis;

  constructor(client: Redis) {
    this.client = client;
    this.add = this.add.bind(this);
  }
  
  async add(message: IMessage) {
    await this.client
      .multi()
      .zadd(
        `rooms:${message.to}:chats`,
        `${Date.now()}`,
        JSON.stringify(message)
      )
      .zadd('rooms', `${(new Date).getTime()}`, JSON.stringify(message.to))
      .exec();
  }
}

export interface IChatMessage {
  client: Redis;
  add(message: IMessage): void;
}