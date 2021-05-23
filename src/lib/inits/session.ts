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
  const sessionOptions: SessionOptions = {
    name: "connect.sid",
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET || "secret",
    store: redisSession,
    unset: "destroy"
  };
  if (app.get('env') === 'production') {
    // TO DO: finish
    // new Chrome requirements:
    /*sessionOptions.cookie = {
      sameSite: none,
      secure: true
    };*/
    /*sessionOptions.cookie = {
      sameSite: true,
      maxAge: 86400000,
      httpOnly: true,
      secure: true
    };*/
  } else {
    sessionOptions.cookie = {
      httpOnly: false,
      maxAge: 86400000,
      sameSite: false,
      secure: false
    };
  }
  socketInit(pool, redisClients, redisSession, httpServer);
  return expressSession(sessionOptions);
}