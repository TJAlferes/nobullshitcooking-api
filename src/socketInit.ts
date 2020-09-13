'use strict';

import { RedisStore } from 'connect-redis';
import { Server } from 'http';
import socketIO from 'socket.io';
import redisAdapter from 'socket.io-redis';

import { useSocketAuth } from './chat/socketAuth';
import { socketConnection } from './chat/socketConnection';
import { cleanUp } from './chat/workers';
import { pubClient, subClient } from './lib/connections/redisConnection';

export function socketInit(server: Server, redisSession: RedisStore) {
  const io = socketIO(server, {pingTimeout: 60000});

  io.adapter(redisAdapter({pubClient, subClient}));

  useSocketAuth(io, redisSession);  // pass pubClient?
  
  io.on('connection', socketConnection);

  // move this to separate server/lambda?
  const INTERVAL = 60 * 60 * 1000 * 3;  // 3 hours
  if (process.env.NODE_ENV !== "test") setInterval(cleanUp, INTERVAL);

  //return io;
}