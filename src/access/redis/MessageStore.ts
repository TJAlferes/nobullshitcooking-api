import { Redis } from 'ioredis';

import { IMessage } from '../../chat/entities/types';

const MESSAGES_TTL = 24 * 60 * 60;

export class MessageStore implements IMessageStore {
  client: Redis;

  constructor(client: Redis) {
    this.client = client;
    this.add = this.add.bind(this);
  }
  
  async add(message: IMessage) {
    await this.client
      .multi()
      .zadd(`rooms:${message.to}:messages`, JSON.stringify(message))
      .expire(`rooms:${message.to}:messages`, MESSAGES_TTL)
      .exec();
  }
}

export interface IMessageStore {
  client: Redis;
  add(message: IMessage): void;
}

/*
getForUserId(userId: string) {
  return this.redisClient
    .lrange(`messages:${userId}`, 0, -1)
    .then(results => results.map(result => JSON.parse(result)));
}

save(message: any) {
  const value = JSON.stringify(message);
  this.redisClient
    .multi()
    .rpush(`messages:${message.from}`, value)
    .rpush(`messages:${message.to}`, value)
    .expire(`messages:${message.from}`, CONVERSATION_TTL)
    .expire(`messages:${message.to}`, CONVERSATION_TTL)
    .exec();
}
*/