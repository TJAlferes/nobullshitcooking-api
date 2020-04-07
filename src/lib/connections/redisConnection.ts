'use strict';

import Redis from 'ioredis';

export const pubClient = process.env.NODE_ENV === 'production'
? new Redis({host: process.env.ELASTICACHE_PROD_PRIMARY, port: 6379})
: new Redis({host: 'redis-dev', port: 6379});

export const subClient = process.env.NODE_ENV === 'production'
? new Redis({host: process.env.ELASTICACHE_PROD_PRIMARY, port: 6379})
: new Redis({host: 'redis-dev', port: 6379});

export const sessClient = process.env.NODE_ENV === 'production'
? new Redis({host: process.env.ELASTICACHE_PROD_PRIMARY, port: 6379})
: new Redis({host: 'redis-dev', port: 6379});

export const workerClient = process.env.NODE_ENV === 'production'
? new Redis({host: process.env.ELASTICACHE_PROD_PRIMARY, port: 6379})
: new Redis({host: 'redis-dev', port: 6379});

// set up proper retry logic

pubClient.on('connect', () => console.log('pub connect!'));
pubClient.on('ready', () => console.log('pub ready!'));
pubClient.on('error', () => console.log('pub error!'));
pubClient.on('close', () => console.log('pub close!'));

subClient.on('connect', () => console.log('sub connect!'));
subClient.on('ready', () => console.log('sub ready!'));
subClient.on('error', () => console.log('sub error!'));
subClient.on('close', () => console.log('sub close!'));

sessClient.on('connect', () => console.log('sess connect!'));
sessClient.on('ready', () => console.log('sess ready!'));
sessClient.on('error', () => console.log('sess error!'));
sessClient.on('close', () => console.log('sess close!'));

workerClient.on('connect', () => console.log('worker connect!'));
workerClient.on('ready', () => console.log('worker ready!'));
workerClient.on('error', () => console.log('worker error!'));
workerClient.on('close', () => console.log('worker close!'));