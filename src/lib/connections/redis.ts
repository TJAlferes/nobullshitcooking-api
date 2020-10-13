'use strict';

import Redis from 'ioredis';

const devConfig = {host: 'redis-dev', port: 6379};
const prodConfig = {host: process.env.ELASTICACHE_PROD_PRIMARY, port: 6379};
const testConfig = {
  autoResendUnfulfilledCommands: false,
  host: 'redis-test',
  maxRetriesPerRequest: 0,
  port: 6379,
  retryStrategy: (times: number) => null,
  showFriendlyErrorStack: true
};
const config = process.env.NODE_ENV === 'production'
  ? prodConfig
  : process.env.NODE_ENV === 'test'
    ? testConfig
    : devConfig;
const pubClient = new Redis(config);
const subClient = new Redis(config);
const sessClient = new Redis(config);
const workerClient = new Redis(config);

if (process.env.NODE_ENV !== 'test') {
  pubClient.on('connect', () => console.log('pubClient connected'));
  pubClient.on('ready', () => console.log('pubClient ready'));
  pubClient.on('error', () => console.log('pubClient error'));
  pubClient.on('close', () => console.log('pubClient closed'));

  subClient.on('connect', () => console.log('subClient connected'));
  subClient.on('ready', () => console.log('subClient ready'));
  subClient.on('error', () => console.log('subClient error'));
  subClient.on('close', () => console.log('subClient closed'));

  sessClient.on('connect', () => console.log('sessClient connected'));
  sessClient.on('ready', () => console.log('sessClient ready'));
  sessClient.on('error', () => console.log('sessClient error'));
  sessClient.on('close', () => console.log('sessClient closed'));

  workerClient.on('connect', () => console.log('workerClient connected'));
  workerClient.on('ready', () => console.log('workerClient ready'));
  workerClient.on('error', () => console.log('workerClient error'));
  workerClient.on('close', () => console.log('workerClient closed'));
}

export const redisClients = {pubClient, subClient, sessClient, workerClient};