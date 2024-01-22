import Redis from 'ioredis';
import type { RedisOptions } from 'ioredis';

let config: RedisOptions = {};
let subClientConfig: RedisOptions = {};

if (process.env.NODE_ENV === 'production') {
  config = {
    host: process.env.ELASTICACHE_PROD_PRIMARY,
    password: process.env.REDIS_AUTH_TOKEN,  //
    port: 6379,
    tls: {},
    lazyConnect: true,
  } as RedisOptions;
  subClientConfig = {
    ...config,
    host: process.env.ELASTICACHE_PROD_READER,
    password: process.env.REDIS_AUTH_TOKEN,
    readOnly: true
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

const pubClient = new Redis(config);
const subClient = new Redis(process.env.NODE_ENV === 'production' ? subClientConfig : config);
//const subClient = new Redis(config);
const sessionClient = new Redis(config);

pubClient.on('connect', () => console.log('pubClient connected'));
pubClient.on('ready', () => console.log('pubClient ready'));
pubClient.on('error', (err) => console.log('pubClient error: ', err.message));
if (process.env.NODE_ENV !== 'test') {
  pubClient.on('close', () => console.log('pubClient closed'));
}

subClient.on('connect', () => console.log('subClient connected'));
subClient.on('ready', () => console.log('subClient ready'));
subClient.on('error', (err) => console.log('subClient error: ', err.message));
if (process.env.NODE_ENV !== 'test') {
  subClient.on('close', () => console.log('subClient closed'));
}

sessionClient.on('connect', () => console.log('sessionClient connected'));
sessionClient.on('ready', () => console.log('sessionClient ready'));
sessionClient.on('error', (err) => console.log('sessionClient error: ', err.message));
if (process.env.NODE_ENV !== 'test') {
  sessionClient.on('close', () => console.log('sessionClient closed'));
}

export const redisClients = {
  pubClient,
  subClient,
  sessionClient
};

export async function connectRedisClient(client: Redis) {
  try {
    await client.connect();
    const result = await client.ping();
    if (result === 'PONG') {
      console.log('Redis Connection success.');
    } else {
      console.error('IN TRY: Redis Connection error message: ', result);
    }
  } catch (error: any) {
    console.error('IN CATCH: Redis Connection error message: ', error.message);
  }
}
