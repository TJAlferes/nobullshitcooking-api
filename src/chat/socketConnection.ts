'use strict';

import { Pool } from 'mysql2/promise';
import { Socket } from 'socket.io';  // TO DO: replace uws with eiows?

import { Friendship, User } from '../access/mysql';
import { ChatMessage } from '../access/redis/ChatMessage';
import { ChatRoom } from '../access/redis/ChatRoom';
import { ChatUser } from '../access/redis/ChatUser';
import { MessageStore } from '../access/redis/MessageStore';
import { RoomStore } from '../access/redis/RoomStore';
import { SessionStore } from '../access/redis/SessionStore';
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

export function socketConnection(
  pool: Pool,
  { pubClient, subClient }: RedisClients
) {
  return async function(socket: Socket) {
    const user = new User(pool);
    const friendship = new Friendship(pool);

    const chatMessage = new ChatMessage(pubClient);
    const chatRoom = new ChatRoom(pubClient, subClient);
    const chatUser = new ChatUser(pubClient);
    const messageStore = new MessageStore(pubClient);  // change client?
    const roomStore = new RoomStore(pubClient, subClient);          // ?
    const sessionStore = new SessionStore(pubClient);  // change client?

    sessionStore.saveSession(socket.sessionId, {
      userId: socket.userId,
      username: socket.username,
      connected: "true"
    });

    socket
      .emit('session', {sessionId: socket.sessionId, userId: socket.userId});

    socket.join(socket.userId);

    // fetch existing users (similar to GetOnline?)
    const users = [];
    const [ messages, sessions ] = await Promise.all([
      messageStore.findMessagesForUser(socket.userId),
      sessionStore.findAllSessions()
    ]);
    const messagesPerUser = new Map();

    messages.forEach(message => {
      const { from, to } = message;
      const otherUser = socket.userId === from ? to : from;

      if (messagesPerUser.has(otherUser)) {
        messagesPerUser.get(otherUser).push(message);
        return;
      }

      messagesPerUser.set(otherUser, [message]);
    });

    sessions.forEach(({ userId, username, connected }) => {
      users.push({userId, username, connected, messages: messagesPerUser.get(userId) || []})
    });

    socket.emit('users', users);

    /*
    
    Users

    */

    // TO DO:
    // no longer appear online
    // for users blocked and friends deleted
    // during that same session
    
    // rename
    socket.on('GetOnline', async function() {
      await getOnline({username, socket, chatUser, friendship});
    });

    socket.on('GetUser', async function(room: string) {
      await getUser({room, socket, chatRoom});
    });

    /*
    
    Messages

    */

    socket.on('AddPublicMessage', async function(text: string) {
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

    /*
    
    Rooms

    */

    socket.on('AddRoom', async function(room: string) {
      await addRoom({room, username, socket, chatRoom});
    });

    socket.on('RejoinRoom', async function(room: string) {
      await rejoinRoom({room, username, socket, chatRoom});
    });

    /*
    
    SocketIO events

    */

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
      const matchingSockets = await io.in(socket.userId).allSockets();
      const disconnected = matchingSockets.size === 0;
      
      if (disconnected) {
        socket.broadcast.emit('user disconnected', socket.userId);

        sessionStore.saveSession(socket.sessionId, {
          userId: socket.userId,
          username: socket.username,
          connected: false
        });
      }
    });
  }
}