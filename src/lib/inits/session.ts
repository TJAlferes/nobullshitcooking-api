'use strict';

import connectRedis from 'connect-redis';
import { Application } from 'express';
import expressSession, { SessionOptions } from 'express-session';
import { Server } from 'http';
import { Pool } from 'mysql2/promise';

import { RedisClients } from '../../app';
import { socketInit } from '.';

export function sessionInit(
  app: Application,
  pool: Pool,
  redisClients: RedisClients,
  httpServer: Server
) {
  const RedisStore = connectRedis(expressSession);
  const redisSession = new RedisStore({client: redisClients.sessClient});
  const options: SessionOptions = {
    cookie: {},
    resave: true,
    saveUninitialized: true,  // false?
    secret: process.env.SESSION_SECRET || "secret",
    store: redisSession,
    unset: "destroy"
  };

  // httpOnly: if true, client-side JS can NOT see the cookie in document.cookie
  // maxAge: 86400000 milliseconds = 1 day
  // sameSite: true | false | "lax" | "none" | "strict" https://github.com/expressjs/session#cookiesamesite
  if (app.get('env') === 'production') {
    options.cookie =
      {httpOnly: true, maxAge: 86400000, sameSite: true, secure: true};
  } else {
    options.cookie =
      {httpOnly: false, maxAge: 86400000, sameSite: false, secure: false};
  }

  socketInit(pool, redisClients, redisSession, httpServer);

  return expressSession(options);
}