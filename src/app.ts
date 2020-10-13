'use strict';

import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import { Redis } from 'ioredis';
import { Pool } from 'mysql2/promise';
import { Client } from '@elastic/elasticsearch';

import { middlewareInit}  from './middlewareInit';
import { routesInit } from './routesInit';
//import { bulkUp } from './search';

const app = express();
const server = createServer(app);

export function appServer(
  pool: Pool,
  esClient: Client,
  redisClients: RedisClients
) {
  middlewareInit(app, pool, redisClients, server);  // must be called before routesInit
  routesInit(app, pool, esClient);
  process.on('unhandledRejection', (reason, promise: Promise<any>) => {
    console.log('Unhandled Rejection at:', reason);
  });
  if (process.env.NODE_ENV === 'production') {
    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
      res.status(500).json({error: error.message || 'something went wrong'});
    });
  } else {
    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
      res.status(500).json({error});
    });
  }
  // move this, and create startup conditional
  /*try {
    setTimeout(() => {
      console.log('Now running bulkUp.');
      bulkUp();
    }, 60000);  // at the 1 minute mark
  } catch(err) {
    console.log(err);
  }*/
  return server;
}

export type RedisClients = {
  pubClient: Redis;
  subClient: Redis;
  sessClient: Redis;
  workerClient: Redis;
}