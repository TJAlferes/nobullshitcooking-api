import { Redis } from 'ioredis';

let config = {};

if (process.env.NODE_ENV === 'production') {
  config = {
    host: process.env.ELASTICACHE_PROD_PRIMARY,
    port: 6379
  };
}

if (process.env.NODE_ENV === 'test') {
  config = {
    autoResendUnfulfilledCommands: false,
    host: 'redis-test',
    maxRetriesPerRequest: 0,
    port: 6379,
    retryStrategy: (times: number) => null,
    showFriendlyErrorStack: true
  };
}

if (process.env.NODE_ENV === 'development') {
  config = {
    host: 'redis-dev',
    port: 6379
  };
}

export const redisClient = new Redis(config);

redisClient.on('connect', () => console.log('redisClient connected'));
redisClient.on('ready',   () => console.log('redisClient ready'));
redisClient.on('error',   () => console.log('redisClient error'));
if (process.env.NODE_ENV !== 'test') {
  redisClient.on('close', () => console.log('redisClient closed'));
}
