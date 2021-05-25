'use strict';

import { Pool } from 'mysql2/promise';
import { Socket } from 'socket.io';  // TO DO: replace uws with eiows?

import { Friendship, User } from '../access/mysql';
//import { ChatMessage } from '../access/redis/ChatMessage';
//import { ChatRoom } from '../access/redis/ChatRoom';
//import { ChatUser } from '../access/redis/ChatUser';
import { MessageStore, /*RoomStore,*/ SessionStore } from '../access/redis';
import { RedisClients } from '../app';
import {
  addPrivateMessage,
  addPublicMessage,
  addRoom,
  disconnecting,
  getOnline,
  getUser,
  rejoinRoom
} from './handlers';

// remove indirection? move to inits/socket.ts?
export function socketConnection(
  pool: Pool,
  { pubClient, subClient }: RedisClients
) {
  return async function(socket: Socket) {
    const { sessionId, userId, username } = socket;

    const user = new User(pool);
    const friendship = new Friendship(pool);

    //const chatMessage = new ChatMessage(pubClient);
    //const chatRoom = new ChatRoom(pubClient, subClient);
    //const chatUser = new ChatUser(pubClient);
    const messageStore = new MessageStore(pubClient);  // change client?
    //const roomStore = new RoomStore(pubClient, subClient);          // ?
    const sessionStore = new SessionStore(pubClient);  // change client?



    sessionStore.save(sessionId, {userId, username, connected: "true"});

    socket.emit('session', {sessionId, userId});
    socket.join(userId);

    // fetch existing users (similar to GetOnline?)
    const users = [];
    const [ messages, sessions ] = 
      await Promise.all([messageStore.getForUserId(userId), sessionStore.get()]);

    const messagesPerUser = new Map();
    messages.forEach(message => {
      const { from, to } = message;
      const otherUser = userId === from ? to : from;

      if (messagesPerUser.has(otherUser)) {
        messagesPerUser.get(otherUser).push(message);
        return;
      }

      messagesPerUser.set(otherUser, [message]);
    });

    sessions.forEach(({ userId, username, connected }) => {
      const messages = messagesPerUser.get(userId) || [];
      users.push({userId, username, connected, messages});
    });

    socket.emit('users', users);



    // Users

    // TO DO:
    // no longer appear online
    // for users blocked and friends deleted
    // during that same session
    // so emit ShowOffline
    
    // rename
    socket.on('GetOnline', async function() {
      await getOnline({username, socket, chatUser, friendship});
    });

    socket.on('GetUser', async function(room: string) {
      await getUser({room, socket, chatRoom});
    });

    // Messages

    socket.on('AddMessage', async function(text: string) {
      await addPublicMessage({username, text, socket, chatMessage});
    });

    socket.on('AddPrivateMessage', async function(text: string, to: string) {
      await addPrivateMessage({
        to,
        socket.username,
        text,
        socket,
        chatUser,
        friendship,
        user
      });
    });

    // Rooms

    socket.on('AddRoom', async function(room: string) {
      await addRoom({room, username, socket, chatRoom});
    });

    socket.on('RejoinRoom', async function(room: string) {
      await rejoinRoom({room, username, socket, chatRoom});
    });

    // SocketIO events

    socket.on('error', (error: Error) => console.log('error: ', error));

    socket.on('disconnecting', async function(reason: any) {
      await disconnecting({
        reason,
        username,
        socket,
        chatRoom,
        chatUser,
        friendship
      });
    });

    socket.on('disconnect', async function(/*reason*/) {
      //console.log('disconnect reason: ', reason);
      const matchingSockets = await io.in(userId).allSockets();
      const disconnected = matchingSockets.size === 0;
      if (disconnected) {
        socket.broadcast.emit('user disconnected', userId);
        // await?
        sessionStore.save(sessionId, {userId, username, connected: "false"});
      }
    });
  }
}