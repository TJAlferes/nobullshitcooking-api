'use strict';

import { pool } from '../lib/connections/mysqlPoolConnection';
const NOBSCUser = require('../mysql-access/User');
const NOBSCFriendship = require('../mysql-access/Friendship');

import { pubClient, subClient } from '../lib/connections/redisConnection';

const MessengerChat = require('../redis-access/MessengerChat');
const MessengerRoom = require('../redis-access/MessengerRoom');
const MessengerUser = require('../redis-access/MessengerUser');

const getOnline = require('./handlers/getOnline');
const getUser = require('./handlers/getUser');
const addChat = require('./handlers/addChat');
const addWhisper = require('./handlers/addWhisper');
const addRoom = require('./handlers/addRoom');
const rejoinRoom = require('./handlers/rejoinRoom');
const disconnecting = require('./handlers/disconnecting');

const User = require('./entities/User');
const ChatMessage = require('./entities/ChatMessage');
const Whisper = require('./entities/Whisper');

export async function socketConnection(socket) {
  const userId = socket.request.userInfo.userId;
  const username = socket.request.userInfo.username;
  const avatar = socket.request.userInfo.avatar;

  // move these up?
  const nobscUser = new NOBSCUser(pool);
  const nobscFriendship = new NOBSCFriendship(pool);
  const messengerUser = new MessengerUser(pubClient);
  const messengerRoom = new MessengerRoom(pubClient, subClient);
  const messengerChat = new MessengerChat(pubClient);

  // Users

  //the one thing left to do here is
  //no longer appear online for blocked users and deleted friends during that same session,
  //the former we should definitely implement,
  //the latter we may need really need
  // rename
  socket.on('GetOnline', function() {
    getOnline(
      socket,
      User,
      nobscFriendship,
      messengerUser,
      userId,
      username,
      avatar
    );
  });

  socket.on('GetUser', function(room) {
    getUser(socket, messengerRoom, room);
  });

  // Messages

  socket.on('AddChat', function(chatMessageText) {
    addChat(
      socket,
      ChatMessage,
      User,
      messengerChat,
      chatMessageText,
      userId,
      username,
      avatar
    );
  });

  socket.on('AddWhisper', function(whisperText, to) {
    addWhisper(
      socket,
      Whisper,
      User,
      nobscUser,
      nobscFriendship,
      messengerUser,
      whisperText,
      to,
      userId,
      username,
      avatar
    );
  });

  // Rooms

  socket.on('AddRoom', function(room) {
    addRoom(
      socket,
      User,
      messengerRoom,
      userId,
      username,
      avatar,
      room
    );
  });

  socket.on('RejoinRoom', function(room) {
    rejoinRoom(
      socket,
      User,
      messengerRoom,
      userId,
      username,
      avatar,
      room
    );
  });

  // SocketIO events

  socket.on('error', (error) => console.log('error: ', error));

  socket.on('disconnecting', function(reason) {
    disconnecting(
      socket,
      User,
      messengerRoom,
      messengerUser,
      nobscFriendship,
      userId,
      username,
      avatar,
      reason
    );
  });

  /*socket.on('disconnect', async function(reason) {
    console.log('disconnect; reason: ', reason);
  });*/
}