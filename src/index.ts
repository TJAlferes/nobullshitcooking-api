'use strict';

//require('regenerator-runtime/runtime');  // still needed?
require('dotenv').config();

import { esClient } from './lib/connections/elasticsearch';
import { pool } from './lib/connections/mysql';
import { redisClients } from './lib/connections/redis';
import { appServer } from './app';

const server = appServer(pool, esClient, redisClients);

const PORT = (process.env.NODE_ENV === 'production')
  ? Number(process.env.PORT) || 8081
  : Number(process.env.PORT) || 3003;

const HOST = (process.env.NODE_ENV === 'production')
  ? '127.0.0.1'
  : '0.0.0.0';

server.listen(PORT, HOST, () => console.log('Listening on port ' + PORT));