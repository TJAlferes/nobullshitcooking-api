'use strict';

import { Server } from 'http';
import { RedisStore } from 'connect-redis';
import socketIO from 'socket.io';
import redisAdapter from 'socket.io-redis';

import { pubClient, subClient } from './lib/connections/redisConnection';
import { socketConnection } from './chat/socketConnection';
import { useSocketAuth } from './chat/socketAuth';
import { cleanUp } from './chat/workers';

export function socketInit(server: Server, redisSession: RedisStore) {
  const io = socketIO(server, {pingTimeout: 60000});

  io.adapter(redisAdapter({pubClient, subClient}));

  useSocketAuth(io, redisSession);  // pass pubClient?
  
  io.on('connection', socketConnection);

  const INTERVAL = 60 * 60 * 1000 * 3;  // 3 hours
  setInterval(cleanUp, INTERVAL);

  //return io;
}