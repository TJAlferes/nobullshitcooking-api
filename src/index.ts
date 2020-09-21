'use strict';

require('regenerator-runtime/runtime');
require('dotenv').config();

import { esClient } from './lib/connections/elasticsearchClient';
import { pool } from './lib/connections/mysqlPoolConnection';
import { appServer } from './app';

const server = appServer(pool, esClient);
let PORT: number = Number(process.env.PORT) || 3003;;
let HOST: string = '0.0.0.0';;
if (process.env.NODE_ENV === 'production') {
  PORT = Number(process.env.PORT) || 8081;
  HOST = '127.0.0.1';
}
server.listen(PORT, HOST, () => console.log('Listening on port ' + PORT));