'use strict';

import { RedisStore } from 'connect-redis';
import { Server } from 'http';
import { Pool } from 'mysql2/promise';
const SocketIO = require('socket.io');
import { createAdapter } from 'socket.io-redis';

import { useSocketAuth } from '../../chat/socketAuth';
import { socketConnection } from '../../chat/socketConnection';
import { cleanUp } from '../../chat/workers';
import { RedisClients } from '../../app';

export function socketInit(
  pool: Pool,
  redisClients: RedisClients,
  redisSession: RedisStore,
  httpServer: Server
) {
  const io = new SocketIO(httpServer, {
    cors: {
      //allowedHeaders: ["sid", "userInfo"],
      credentials: true,
      methods: ["GET", "POST"],
      origin: ["https://nobullshitcooking.com", "http://localhost:8080"]
    },
    pingTimeout: 60000
  });
  const handler = socketConnection(pool, redisClients);
  const { pubClient, subClient, workerClient } = redisClients;
  //pubClient.duplicate()
  io.adapter(createAdapter({pubClient, subClient}));
  useSocketAuth(io, pubClient, redisSession);
  io.on('connection', handler);
  // move this to separate server/lambda? TO DO: use TTL in Redis now
  const job = () => cleanUp(workerClient);
  const INTERVAL = 60 * 60 * 1000 * 3;  // 3 hours
  if (process.env.NODE_ENV !== "test") setInterval(job, INTERVAL);
  //return io;
}