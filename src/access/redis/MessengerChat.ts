import { Redis } from 'ioredis';

import { IMessage } from '../../chat/entities/types';

export class MessengerChat implements IMessengerChat {
  client: Redis;

  constructor(client: Redis) {
    this.client = client;
    this.addMessage = this.addMessage.bind(this);
  }
  
  async addMessage(message: IMessage) {
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

export interface IMessengerChat {
  client: Redis;
  addMessage(message: IMessage): void;
}