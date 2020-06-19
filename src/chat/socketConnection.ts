'use strict';

import { Socket } from 'socket.io';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { pubClient, subClient } from '../lib/connections/redisConnection';
import { Friendship as NOBSCFriendship } from '../mysql-access/Friendship';
import { User as NOBSCUser } from '../mysql-access/User';
import { MessengerChat } from '../redis-access/MessengerChat';
import { MessengerRoom } from '../redis-access/MessengerRoom';
import { MessengerUser } from '../redis-access/MessengerUser';
import { addChat } from './handlers/addChat';
import { addRoom } from './handlers/addRoom';
import { addWhisper } from './handlers/addWhisper';
import { disconnecting } from './handlers/disconnecting';
import { getOnline } from './handlers/getOnline';
import { getUser } from './handlers/getUser';
import { rejoinRoom } from './handlers/rejoinRoom';

export async function socketConnection(socket: Socket) {
  const userId = socket.request.userInfo.userId;
  const username = socket.request.userInfo.username;
  const avatar = socket.request.userInfo.avatar;
  
  const nobscUser = new NOBSCUser(pool);
  const nobscFriendship = new NOBSCFriendship(pool);
  const messengerUser = new MessengerUser(pubClient);
  const messengerRoom = new MessengerRoom(pubClient, subClient);
  const messengerChat = new MessengerChat(pubClient);

  // async?

  // Users

  //the one thing left to do here is
  //no longer appear online for blocked users and deleted friends during that same session,
  //the former we should definitely implement,
  //the latter we may need really need
  // rename
  socket.on('GetOnline', function() {
    getOnline(
      socket,
      nobscFriendship,
      messengerUser,
      userId,
      username,
      avatar
    );
  });

  socket.on('GetUser', function(room: string) {
    getUser(socket, messengerRoom, room);
  });

  // Messages

  socket.on('AddChat', function(chatMessageText: string) {
    addChat(
      socket,
      messengerChat,
      chatMessageText,
      userId,
      username,
      avatar
    );
  });

  socket.on('AddWhisper', function(whisperText: string, to: string) {
    addWhisper(
      socket,
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

  socket.on('AddRoom', function(room: string) {
    addRoom(
      socket,
      messengerRoom,
      userId,
      username,
      avatar,
      room
    );
  });

  socket.on('RejoinRoom', function(room: string) {
    rejoinRoom(
      socket,
      messengerRoom,
      userId,
      username,
      avatar,
      room
    );
  });

  // SocketIO events

  socket.on('error', (error: Error) => console.log('error: ', error));

  socket.on('disconnecting', function(reason: any) {
    disconnecting(
      socket,
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