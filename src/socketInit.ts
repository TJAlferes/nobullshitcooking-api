'use strict';

import { RedisStore } from 'connect-redis';
import { Server } from 'http';
import { Pool } from 'mysql2/promise';
import socketIO from 'socket.io';
import redisAdapter from 'socket.io-redis';

import { useSocketAuth } from './chat/socketAuth';
import { socketConnection } from './chat/socketConnection';
import { cleanUp } from './chat/workers';
import { pubClient, subClient } from './lib/connections/redisConnection';  // to do

export function socketInit(
  pool: Pool,
  redisSession: RedisStore,
  server: Server
) {
  const io = socketIO(server, {pingTimeout: 60000});
  const handler = socketConnection(pool);
  io.adapter(redisAdapter({pubClient, subClient}));  // to do
  useSocketAuth(io, redisSession);  // pass pubClient?
  io.on('connection', handler);
  // move this to separate server/lambda?
  const INTERVAL = 60 * 60 * 1000 * 3;  // 3 hours
  if (process.env.NODE_ENV !== "test") setInterval(cleanUp, INTERVAL);
  //return io;
}