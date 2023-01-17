'use strict';

import * as dotenv from 'dotenv';
dotenv.config();

import { pool }         from './lib/connections/mysql.js';
import { redisClients } from './lib/connections/redis.js';
import { appServer }    from './app.js';

// Kept separate for multiple reasons, easy integration testing being primary.
const server = appServer(pool, redisClients);

const PORT = (process.env.NODE_ENV === 'production')
  ? Number(process.env.PORT) || 8081
  : Number(process.env.PORT) || 3003;

const HOST = (process.env.NODE_ENV === 'production')
  ? '127.0.0.1'
  : '0.0.0.0';

server.listen(PORT, HOST, () => console.log('Listening on port ' + PORT));