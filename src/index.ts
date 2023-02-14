'use strict';

import * as dotenv from 'dotenv';
dotenv.config();

import { pool }         from './lib/connections/mysql';
import { redisClients } from './lib/connections/redis';
import { appServer }    from './app';

export const { httpServer, io } = appServer(pool, redisClients);

const PORT = (process.env.NODE_ENV === 'production')
  ? Number(process.env.PORT) || 8081
  : Number(process.env.PORT) || 3003;

const HOST = (process.env.NODE_ENV === 'production')
  ? '127.0.0.1'
  : '0.0.0.0';

httpServer.listen(PORT, HOST, () => console.log('HTTP server listening on port ' + PORT));
