'use strict';

const socketIO = require('socket.io');
const redisAdapter = require('socket.io-redis');

const {
  pubClient,
  subClient
} = require('./lib/connections/redisConnection');

const socketConnection = require('./chat/socketConnection');
const { socketAuth } = require('./chat/socketAuth');
const cleanUp = require('./chat/workers');

function socketInit(server, redisSession) {
  const io = socketIO(server, {pingTimeout: 60000});

  io.adapter(redisAdapter({pubClient, subClient}));
  io.use(socketAuth(redisSession));
  io.on('connection', socketConnection);

  const INTERVAL = 60 * 60 * 1000 * 3;  // 3 hours
  setInterval(cleanUp, INTERVAL);

  //return io;
}

module.exports = socketInit;