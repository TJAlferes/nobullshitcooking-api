'use strict';

require('regenerator-runtime/runtime');
require('dotenv').config();

import { esClient } from './lib/connections/elasticsearch';
import { pool } from './lib/connections/mysql';
import { redisClients } from './lib/connections/redis';
import { appServer } from './app';

const server = appServer(pool, esClient, redisClients);
let PORT: number = Number(process.env.PORT) || 3003;
let HOST: string = '0.0.0.0';
if (process.env.NODE_ENV === 'production') {
  PORT = Number(process.env.PORT) || 8081;
  HOST = '127.0.0.1';
}
server.listen(PORT, HOST, () => console.log('Listening on port ' + PORT));