import { Redis } from 'ioredis';

import { IChatMessage } from '../../chat/entities/types';

export class MessengerChat implements IMessengerChat {
  client: Redis;

  constructor(client: Redis) {
    this.client = client;
    this.addMessage = this.addMessage.bind(this);
  }
  
  async addMessage(message: IChatMessage) {
    await this.client
      .multi()
      .zadd(
        `rooms:${message.room}:chats`,
        `${Date.now()}`,
        JSON.stringify(message)
      )
      .zadd('rooms', `${(new Date).getTime()}`, JSON.stringify(message.room))
      .exec();
  }
}

export interface IMessengerChat {
  client: Redis;
  addMessage(message: IChatMessage): void;
}