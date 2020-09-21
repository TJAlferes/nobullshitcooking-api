'use strict';

import compression from 'compression';
import cors from 'cors';
//import csurf from 'csurf');  // no longer needed?
import express, { Application } from 'express';
//import expressPinoLogger from 'express-pino-logger');
import expressRateLimit from 'express-rate-limit';  // Use rate-limiter-flexible instead? https://github.com/animir/node-rate-limiter-flexible
import helmet from 'helmet';
//import hpp from 'hpp');
import { Server } from 'http';
import { Pool } from 'mysql2/promise';

import { sessionInit } from './sessionInit';

export function middlewareInit(app: Application, pool: Pool, server: Server) {
  // limit each IP requests per minute:
  const rateLimiterOptions = {windowMs: 1 * 60 * 1000, max: 100};  // 1000?
  const corsOptions = {origin: ['http://localhost:8080'], credentials: true};
  if (app.get('env') === 'production') {
    app.set('trust proxy', 1);  // trust first proxy
    corsOptions.origin = ['https://nobullshitcooking.com'];
  }
  const session = sessionInit(app, pool, server);
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