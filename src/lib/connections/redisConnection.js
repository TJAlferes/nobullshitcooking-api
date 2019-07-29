'use strict';

const Redis = require('ioredis');

const client = process.env.NODE_ENV === 'production'
? new Redis({
  host: process.env.REDIS_HOST,
  port: 6380
})
: new Redis({
  host: 'redis-dev',
  port: 6379
});

module.exports = client;