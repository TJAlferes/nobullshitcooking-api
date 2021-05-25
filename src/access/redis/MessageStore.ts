import { Redis } from 'ioredis';

const CONVERSATION_TTL = 24 * 60 * 60;

// TO DO: change any any types and merge with old code
export class MessageStore implements IMessageStore {
  redisClient: Redis;

  constructor(redisClient: Redis) {
    this.redisClient = redisClient;
    this.getForUserId = this.getForUserId.bind(this);
    this.save = this.save.bind(this);
  }

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
}

interface IMessageStore {
  getForUserId(userId: string): {};
  save(message: any): void;
}