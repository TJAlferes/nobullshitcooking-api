/*
'use strict';

const Redis = require('ioredis');

const pubClient = process.env.NODE_ENV === 'production'
? new Redis({host: process.env.ELASTICACHE_PROD, port: 6379})
: new Redis({host: 'redis-dev', port: 6379});

const subClient = process.env.NODE_ENV === 'production'
? new Redis({host: process.env.ELASTICACHE_PROD, port: 6379})
: new Redis({host: 'redis-dev', port: 6379});

const sessClient = process.env.NODE_ENV === 'production'
? new Redis({host: process.env.ELASTICACHE_PROD, port: 6379})
: new Redis({host: 'redis-dev', port: 6379});

const workerClient = process.env.NODE_ENV === 'production'
? new Redis({host: process.env.ELASTICACHE_PROD, port: 6379})
: new Redis({host: 'redis-dev', port: 6379});

//console.log('========== ioredis new Redis ========== ');
//console.log('pubClient', pubClient);
pubClient.on('connect', () => console.log('pub connect!!!!!!!!!!!'));
pubClient.on('ready', () => console.log('pub ready!!!!!!!!!!!'));
pubClient.on('error', () => console.log('pub error!!!!!!!!!!!'));
pubClient.on('close', () => console.log('pub close!!!!!!!!!!!'));
//console.log('============================== ');

//console.log('========== ioredis new Redis ========== ');
//console.log('subClient', subClient);
subClient.on('connect', () => console.log('sub connect!!!!!!!!!!!'));
subClient.on('ready', () => console.log('sub ready!!!!!!!!!!!'));
subClient.on('error', () => console.log('sub error!!!!!!!!!!!'));
subClient.on('close', () => console.log('sub close!!!!!!!!!!!'));
//console.log('============================== ');

//console.log('========== ioredis new Redis ========== ');
//console.log('sessClient', sessClient);
sessClient.on('connect', () => console.log('sess connect!!!!!!!!!!!'));
sessClient.on('ready', () => console.log('sess ready!!!!!!!!!!!'));
sessClient.on('error', () => console.log('sess error!!!!!!!!!!!'));
sessClient.on('close', () => console.log('sess close!!!!!!!!!!!'));
//console.log('============================== ');
// set up proper retry logic

//console.log('========== ioredis new Redis ========== ');
//console.log('workerClient', workerClient);
workerClient.on('connect', () => console.log('worker connect!!!!!!!!!!!'));
workerClient.on('ready', () => console.log('worker ready!!!!!!!!!!!'));
workerClient.on('error', () => console.log('worker error!!!!!!!!!!!'));
workerClient.on('close', () => console.log('worker close!!!!!!!!!!!'));
//console.log('============================== ');

module.exports = {pubClient, subClient, sessClient, workerClient};
*/