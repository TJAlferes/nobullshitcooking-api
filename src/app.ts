import compression                                  from 'compression';
import RedisStore                                   from "connect-redis"
import cors                                         from 'cors';
import express, { Request, Response, NextFunction } from 'express';
// Use https://github.com/animir/node-rate-limiter-flexible instead?
import expressRateLimit                             from 'express-rate-limit';
import expressSession, { Session }                  from 'express-session';
import helmet                                       from 'helmet';
import hpp                                          from 'hpp';
import { createServer }                             from 'node:http';
import type { Redis }                               from 'ioredis';
const pino = require('pino-http')();  // logger

import { redisClients }         from './connections/redis';
import { createSocketIOServer } from './modules/chat/socketio';
import { apiV1Router }          from './router';

export function createAppServer() {
  const app = express();

  const httpServer = createServer(app);

  if (app.get('env') === 'production') {
    app.set('trust proxy', 1);  // trust first proxy  // insufficient?
  }

  // Express Middleware

  const redisStore = new RedisStore({client: redisClients.sessionClient});
  const sessionMiddleware = expressSession({
    cookie: (app.get('env') === 'production') ? {
      httpOnly: true,    // if true, client-side JS can NOT see the cookie in document.cookie
      maxAge: 86400000,  // 86400000 milliseconds = 1 day
      sameSite: true,
      secure: true
    } : {
      httpOnly: false,
      maxAge: 86400000,
      sameSite: false,
      secure: false
    },
    resave:            false,
    saveUninitialized: false,
    secret:            process.env.SESSION_SECRET || "secret",
    store:             redisStore,
    unset:             "destroy"
  });

  app.use(pino);  // logger
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  app.use(expressRateLimit({
    max: 100,
    windowMs: 1 * 60 * 1000
  }));  // limit each IP address's requests per minute
  app.use(sessionMiddleware);
  app.use(cors({
    credentials: true,
    origin: (app.get('env') === 'production')
      ? ['https://nobullshitcooking.com']
      : ['http://localhost:3000', 'http://localhost:8080']
  }));
  //app.options('*', cors());  // //
  app.use((req: Request, res: Response, next: NextFunction) => {
    const max_age = 60 * 5;  // 5 minutes
    if (req.method === "GET") {
      res.set("Cache-control", `public, max-age=${max_age}`);
    } else {
      res.set("Cache-control", "no-store");
    }
    next();
  });
  app.use(helmet());
  app.use(hpp());
  // why???
  app.use('/search/*', hpp({
    whitelist: [
      'filter',
      'filters.equipmentTypes',
      'filters.ingredientTypes',
      'filters.recipeTypes',
      'filters.methods',
      'filters.cuisines',
      'filters.productTypes',
      'filters.productCategories',
      'sorts',
    ]
  }));
  // no longer maintained!
  // is csrf protection still necessary? if so, find a different solution
  //app.use(csurf());
  app.use(compression());

  app.use('/api/v1', apiV1Router);

  const socketIOServer = createSocketIOServer(httpServer, sessionMiddleware);

  process.on('unhandledRejection', (reason, promise: Promise<any>) => {
    console.log('Unhandled Rejection at: ', reason);
  });

  if (process.env.NODE_ENV === 'production') {
    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
      res.status(500).json({error: error.message || 'An error occurred.'});
    });
  } else {
    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
      console.log(error);
      res.status(500).json({error});
    });
  }

  return {
    httpServer,
    socketIOServer
  };
}

export type ModifiedSession = Session & {
  //staff_id?:  string;
  //staffname?: string;
  user_id?:   string;
  username?:  string;
};

declare module "node:http" {
  interface IncomingMessage {
    session: ModifiedSession;
  }
}

export type RedisClients = {
  pubClient:     Redis;  //| Cluster;
  subClient:     Redis;  //| Cluster;
  sessionClient: RedisStore;  //Client;
  //workerClient:  Redis;
}
