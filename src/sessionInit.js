'use strict';

const expressSession = require("express-session");
const connectRedis = require('connect-redis');

const { sessClient } = require('./lib/connections/redisConnection');

function sessionInit(app) {
  const RedisStore = connectRedis(expressSession);
  const redisSession = new RedisStore({client: sessClient});

  const sessionOptions = {
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
  } else if (app.get('env') === 'development') {
    sessionOptions.cookie = {
      sameSite: false,
      maxAge: 86400000,
      httpOnly: false,
      secure: false
    };
  }
  
  return expressSession(sessionOptions);
}

module.exports = sessionInit;