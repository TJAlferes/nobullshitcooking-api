'use strict';

//import Redis from 'ioredis';
const Redis = require('ioredis');  // temporary "fix" for TypeScript

let config = {};

if (process.env.NODE_ENV === 'test') {
  config = {
    autoResendUnfulfilledCommands: false,
    host:                          'redis-test',
    maxRetriesPerRequest:          0,
    port:                          6379,
    retryStrategy:                 (times: number) => null,
    showFriendlyErrorStack:        true
  };
}

if (process.env.NODE_ENV === 'production') config = {host: process.env.ELASTICACHE_PROD_PRIMARY, port: 6379};

if (process.env.NODE_ENV === 'development') config = {host: 'redis-dev', port: 6379};

const pubClient =     new Redis(config);
const subClient =     new Redis(config);
const sessionClient = new Redis(config);
const workerClient =  new Redis(config);

if (process.env.NODE_ENV !== 'test') {
  pubClient.on('connect',    () => console.log('pubClient connected'));
  pubClient.on('ready',      () => console.log('pubClient ready'));
  pubClient.on('error',      () => console.log('pubClient error'));
  pubClient.on('close',      () => console.log('pubClient closed'));

  subClient.on('connect',    () => console.log('subClient connected'));
  subClient.on('ready',      () => console.log('subClient ready'));
  subClient.on('error',      () => console.log('subClient error'));
  subClient.on('close',      () => console.log('subClient closed'));

  sessionClient.on('connect',   () => console.log('sessionClient connected'));
  sessionClient.on('ready',     () => console.log('sessionClient ready'));
  sessionClient.on('error',     () => console.log('sessionClient error'));
  sessionClient.on('close',     () => console.log('sessionClient closed'));

  workerClient.on('connect', () => console.log('workerClient connected'));
  workerClient.on('ready',   () => console.log('workerClient ready'));
  workerClient.on('error',   () => console.log('workerClient error'));
  workerClient.on('close',   () => console.log('workerClient closed'));
}

export const redisClients = {pubClient, subClient, sessionClient, workerClient};