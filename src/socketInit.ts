'use strict';

import { RedisStore } from 'connect-redis';
import { Server } from 'http';
import { Pool } from 'mysql2/promise';
import socketIO from 'socket.io';
import redisAdapter from 'socket.io-redis';

import { useSocketAuth } from './chat/socketAuth';
import { socketConnection } from './chat/socketConnection';
import { cleanUp } from './chat/workers';
import { RedisClients } from './app';

export function socketInit(
  pool: Pool,
  redisClients: RedisClients,
  redisSession: RedisStore,
  server: Server
) {
  const io = socketIO(server, {pingTimeout: 60000});
  const handler = socketConnection(pool, redisClients);
  const { pubClient, subClient, workerClient } = redisClients;
  io.adapter(redisAdapter({pubClient, subClient}));
  useSocketAuth(io, pubClient, redisSession);
  io.on('connection', handler);
  // move this to separate server/lambda?
  const job = () => cleanUp(workerClient);
  const INTERVAL = 60 * 60 * 1000 * 3;  // 3 hours
  if (process.env.NODE_ENV !== "test") setInterval(job, INTERVAL);
  //return io;
}