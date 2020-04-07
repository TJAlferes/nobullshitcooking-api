import express from 'express';
//import expressPinoLogger from 'express-pino-logger');
import expressRateLimit from 'express-rate-limit';  // Use rate-limiter-flexible instead? https://github.com/animir/node-rate-limiter-flexible
import cors from 'cors';
import helmet from 'helmet';
//import hpp from 'hpp');
//import csurf from 'csurf');  // no longer needed?
import compression from 'compression';

import { sessionInit } from './sessionInit';

export function middlewareInit(app, server) {
  const rateLimiterOptions = {windowMs: 1 * 60 * 1000, max: 1000};  // limit each IP to 1000 requests per minute (100?)

  const corsOptions = {origin: ['http://localhost:8080'], credentials: true};
  
  if (app.get('env') === 'production') {
    app.set('trust proxy', 1);  // trust first proxy
    corsOptions.origin = ['https://nobullshitcooking.com'];
  }
  
  const session = sessionInit(app, server);
  
  //app.use(expressPinoLogger());
  app.use(express.json());
  app.use(express.urlencoded({extended: false}));
  app.use(expressRateLimit(rateLimiterOptions));
  app.use(session);
  app.use(cors(corsOptions));
  //app.options('*', cors());
  app.use(helmet());
  //app.use(hpp());
  //app.use(csurf());
  app.use(compression());
}