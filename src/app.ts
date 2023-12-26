import compression from 'compression';
import RedisStore from 'connect-redis'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { doubleCsrf } from 'csrf-csrf';
import express, { Request, Response, NextFunction } from 'express';
import { rateLimit } from 'express-rate-limit';
import expressSession, { Session, SessionData } from 'express-session';
import helmet from 'helmet';
import hpp from 'hpp';
import { createServer } from 'http';
import { pinoHttp } from 'pino-http';  // logger
import process from 'process';

import { redisClients } from './connections/redis';
import { createSocketIOServer } from './modules/chat/server';
import { instanceOfAnyException } from './utils/exceptions';
import { apiV1Router } from './router';

declare module 'http' {
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

  // TO DO: implement better caching than this
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
    windowMs: 15 * 60 * 1000,  // 15 minutes
	  standardHeaders: 'draft-7',
	  legacyHeaders: false,
	  //store:  // TO DO: Use external store for consistency across multiple server instances.
  });
  app.use(rateLimiter);  // Limit each IP to 100 requests per 15 minutes
}

// Express Middleware

const redisStore = new RedisStore({client: redisClients.sessionClient});
const sessionMiddleware = expressSession({
  cookie: app.get('env') === 'production'
    ? {
      maxAge: 86400000,  // 86400000 ms = 1 day
      httpOnly: true,
      sameSite: 'strict',
      secure: true
    }
    : {
      maxAge: 86400000,
      httpOnly: false,
      sameSite: 'lax'
    },
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET!,
  store: redisStore,
  unset: 'destroy'
});
const { generateToken, doubleCsrfProtection } = doubleCsrf({
  cookieOptions: {
    secure: app.get('env') === 'production' ? true : false
  },
  getSecret: () => process.env.CSRF_SECRET!,
  size: 32
});

if (app.get('env') !== 'test') app.use(pinoHttp());  // logger
app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({extended: true, limit: '10kb'}));
app.use(sessionMiddleware);
app.use(cookieParser(process.env.COOKIE_SECRET!));
app.get("/csrf-token", (req, res) => {
  const csrfToken = generateToken(req, res, true);
  return res.json({csrfToken});
});
if (app.get('env') !== 'test') app.use(doubleCsrfProtection);
app.use(cors({
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  credentials: true,
  methods: 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
  origin: (app.get('env') === 'production')
    ? ['https://nobullshitcooking.com']
    : [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3003',
      'http://localhost:8080'
    ]
}));
app.use(helmet());
app.use(hpp());
/*app.use('/search/*', hpp({
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
}));  // why???*/
app.use(compression());

app.use('/v1', apiV1Router());

export const socketIOServer = createSocketIOServer(httpServer, sessionMiddleware);

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  // TO DO: log or throw an error
});

if (process.env.NODE_ENV === 'production') {
  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    if (instanceOfAnyException(error)) {
      res.status((error as any).code).json({message: error.message});
    } else {
      console.log(error.message);
      res.status(500).json({message: error.message || 'Internal Server Error'});
    }
  });
} else {
  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    if (instanceOfAnyException(error)) {
      res.status((error as any).code).json({message: error.message});
    } else {
      console.log(error);
      res.status(500).json({message: error.message, error});
    }
  });
}
