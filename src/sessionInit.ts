'use strict';

import connectRedis from 'connect-redis';
import { Application } from 'express';
import expressSession, { SessionOptions } from 'express-session';
import { Server } from 'http';

import { sessClient } from './lib/connections/redisConnection';
import { socketInit } from './socketInit';

export function sessionInit(app: Application, server: Server) {
  const RedisStore = connectRedis(expressSession);
  const redisSession = new RedisStore({client: sessClient});

  const sessionOptions: SessionOptions = {
    name: "connect.sid",
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET || "secret",
    store: redisSession,
    unset: "destroy"
  };

  if (app.get('env') === 'production') {
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

  socketInit(server, redisSession);

  return expressSession(sessionOptions);
}