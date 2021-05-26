'use strict';

import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import { Redis } from 'ioredis';
import { Pool } from 'mysql2/promise';
import { Client } from '@elastic/elasticsearch';

import { middlewareInit, routesInit }  from './lib/inits';
import { bulkUp } from './lib/jobs/bulkUp';

const app = express();
const httpServer = createServer(app);

export function appServer(
  pool: Pool,
  esClient: Client,
  redisClients: RedisClients
) {
  middlewareInit(app, pool, redisClients, httpServer);  // must be called before routesInit

  routesInit(app, pool, esClient);

  process.on('unhandledRejection', (reason, promise: Promise<any>) => {
    console.log('Unhandled Rejection at:', reason);
  });

  // TO DO: change again?
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
  if (process.env.NODE_ENV === 'development') {
    try {
      setTimeout(() => {
        console.log('Now running bulkUp.');
        bulkUp(esClient, pool);
      }, 40000);  // at the 40 second mark
    } catch(err) {
      console.error(err);
    }
  }

  return httpServer;
}

export type RedisClients = {
  pubClient: Redis;
  subClient: Redis;
  sessClient: Redis;
  //workerClient: Redis;
}