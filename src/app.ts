import compression from 'compression';
import RedisStore from 'connect-redis'
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import { rateLimit } from 'express-rate-limit';
import expressSession, { Session, SessionData } from 'express-session';
import helmet from 'helmet';
import hpp from 'hpp';
import { createServer } from 'node:http';
import type { Redis } from 'ioredis';
import { pinoHttp } from 'pino-http';  // logger
import process from 'node:process';

import { redisClients } from './connections/redis';
import { createSocketIOServer } from './modules/chat/server';
import { ExceptionError } from './utils/exceptions';
import { apiV1Router } from './router';

declare module 'node:http' {
  interface IncomingMessage {
    session: Session & Partial<SessionData>;
  }
}

declare module 'express-session' {
  interface SessionData {
    user_id?:  string;
    username?: string;
  }
}

export const app = express();

export const httpServer = createServer(app);

if (app.get('env') === 'production') {
  app.set('trust proxy', 1);  // trust first proxy  // insufficient?

  app.use((req: Request, res: Response, next: NextFunction) => {
    const max_age = 60 * 5;  // 5 minutes
    if (req.method === 'GET') {
      res.set('Cache-control', `public, max-age=${max_age}`);
    } else {
      res.set('Cache-control', 'no-store');
    }
    next();
  });

  // Use https://github.com/animir/node-rate-limiter-flexible instead?
  const rateLimiter = rateLimit({
    max: 100,
    windowMs: 1 * 60 * 1000
    //windowMs: 15 * 60 * 1000, // 15 minutes
	   //limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	   //standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	   //legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	   //// store: ... , // Use an external store for consistency across multiple server instances.
  });
  app.use(rateLimiter);  // limit each IP address's requests per minute
}

// Express Middleware

const redisStore = new RedisStore({client: redisClients.sessionClient});
const sessionMiddleware = expressSession({
  cookie: (app.get('env') === 'production')
    ? {
      httpOnly: true,
      maxAge: 86400000,  // 86400000 milliseconds = 1 day
      sameSite: 'none',
      secure: true
    }
    : {
      httpOnly: false,
      maxAge: 86400000,
      sameSite: false,
      secure: false
    },
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET || 'secret',
  store: redisStore,
  unset: 'destroy'
});

app.use(pinoHttp());  // logger
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(sessionMiddleware);
app.use(cors({
  credentials: true,
  origin: (app.get('env') === 'production')
    ? ['https://nobullshitcooking.com']
    : [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3003',
      'http://localhost:8080'
    ]
}));
//app.options('*', cors());  // //
app.use(helmet());
app.use(hpp());
app.use('/search/*', hpp({
  whitelist: [
    'filter',
    'filters.equipment_types',
    'filters.ingredient_types',
    'filters.recipe_types',
    'filters.methods',
    'filters.cuisines',
    'filters.product_types',
    'filters.product_categories',
    'sorts',
  ]
}));  // why???
//app.use(csurf());  // no longer maintained! TO DO: csrf-csrf Double-Submit Cookie
app.use(compression());

app.use('/v1', apiV1Router());

export const socketIOServer = createSocketIOServer(httpServer, sessionMiddleware);

process.on('unhandledRejection', (reason) => {
  console.log('Unhandled Rejection at: ', reason);
});

if (process.env.NODE_ENV === 'production') {
  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof ExceptionError) {
      res.status(error.code).json({message: error.message});
    } else {
      console.log(error.message);
      res.status(500).json({message: error.message || 'Internal Server Error'});
    }
  });
} else {
  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof ExceptionError) {
      res.status(error.code).json({message: error.message});
    } else {
      console.log(error);
      res.status(500).json({message: error.message, error});
    }
  });
}

export type RedisClients = {
  pubClient:     Redis;  //| Cluster;
  subClient:     Redis;  //| Cluster;
  sessionClient: RedisStore;  //Client;
  //workerClient:  Redis;
};
