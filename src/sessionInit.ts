'use strict';

import { Server } from 'http';
import { Application } from 'express';
import expressSession, { SessionOptions } from 'express-session';
import connectRedis from 'connect-redis';

import { sessClient } from './lib/connections/redisConnection';
import { socketInit } from './socketInit';

export function sessionInit(app: Application, server: Server) {
  const RedisStore = connectRedis(expressSession);
  const redisSession = new RedisStore({client: sessClient});

  const sessionOptions: SessionOptions = {
    store: redisSession,
    name: "connect.sid",
    secret: process.env.SESSION_SECRET || "secret",
    resave: true,
    saveUninitialized: true,
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
      sameSite: false,
      maxAge: 86400000,
      httpOnly: false,
      secure: false
    };
  }

  socketInit(server, redisSession);

  return expressSession(sessionOptions);
}