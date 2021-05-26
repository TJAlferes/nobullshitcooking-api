'use strict';

import { RedisStore } from 'connect-redis';
import { Server as HTTPServer } from 'http';
import { Pool } from 'mysql2/promise';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { createAdapter } from 'socket.io-redis';
import { v4 as uuidv4 } from 'uuid';

import { Friendship, User } from '../../access/mysql';
import { MessageStore, SessionStore } from '../../access/redis';
import { RedisClients } from '../../app';
import {
  addPrivateMessage,
  addPublicMessage,
  addRoom,
  disconnecting,
  getOnline,
  getUser,
  rejoinRoom
} from '../../chat/handlers';

export function socketInit(
  pool: Pool,
  redisClients: RedisClients,
  redisSession: RedisStore,
  httpServer: HTTPServer
) {
  const io = new SocketIOServer<IClientToServerEvents, IServerToClientEvents>(
    httpServer,
    {
      cors: {
        //allowedHeaders: ["sid", "userInfo"],
        credentials: true,
        methods: ["GET", "POST"],
        origin: ["https://nobullshitcooking.com", "http://localhost:8080"]
      },
      pingTimeout: 60000
    }
  );
  const { pubClient, subClient } = redisClients;  //pubClient.duplicate()

  io.adapter(createAdapter({pubClient, subClient}));

  io.use(async function(socket: IUberSocket, next: Next) {
    const sessionId = socket.handshake.auth.sessionId;
    if (sessionId) {
      const sessionStore = new SessionStore(pubClient)
      const session = await sessionStore.getById(sessionId);
      if (session) {
        socket.sessionId = sessionId;
        socket.userId = session.userId;
        socket.username = session.username;
        return next();
      }
    }
  
    const username = socket.handshake.auth.username;
    if (!username) return next(new Error('Invalid username.'));
    socket.sessionId = uuidv4();
    socket.userId = uuidv4();
    socket.username = username;
    next();
  });

  io.on('connection', async function(socket: IUberSocket) {
    const { sessionId, userId, username } = socket;

    const user = new User(pool);
    const friendship = new Friendship(pool);
    const messageStore = new MessageStore(pubClient);  // change client?
    const sessionStore = new SessionStore(pubClient);  // change client?

    // persist session (similar to addChatUser?)
    sessionStore.save(sessionId, {userId, username, connected: "true"});

    socket.emit('session', {sessionId, userId});  // emit session details
    socket.join(userId);  // join the userId room

    // fetch existing users (similar to GetOnline?)
    const users = [];
    const [ messages, sessions ] = await Promise.all([
      messageStore.getForUserId(userId), sessionStore.get()
    ]);
    const messagesPerUser = new Map();
    messages.forEach(message => {
      const { from, to } = message;
      const otherUser = userId === from ? to : from;
      if (messagesPerUser.has(otherUser))
        messagesPerUser.get(otherUser).push(message);
      else messagesPerUser.set(otherUser, [message]);
    });
    sessions.forEach(({ userId, username, connected }) => {
      const messages = messagesPerUser.get(userId) || [];
      users.push({userId, username, connected, messages});
    });
    socket.emit('users', users);

    // notify existing users (similar to ShowOnline?)
    socket.broadcast.emit('user connected', {
      userId, username, connected: true, messages: []
    });

    // Users

    // TO DO: no longer appear online for users blocked and friends deleted
    // during that same session (so emit ShowOffline)
    
    socket.on('GetOnline', async function() {  // TO DO: rename
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
        to, username, text, socket, chatUser, friendship, user
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
        reason, username, socket, chatRoom, chatUser, friendship
      });
    });

    socket.on('disconnect', async function(/*reason*/) {
      //console.log('disconnect reason: ', reason);
      const matchingSockets = await io.in(userId).allSockets();
      const disconnected = matchingSockets.size === 0;
      if (disconnected) {
        socket.broadcast.emit('user disconnected', userId);
        sessionStore.save(sessionId, {userId, username, connected: "false"});
      }
    });
  });
}

type Next = (err?: ExtendedError | undefined) => void;

interface IUberSocket extends Socket {
  sessionId: string;
  userId: string;
  username: string;
}

interface IClientToServerEvents {
  // Users
  GetOnline(): void;
  GetUser(room: string): void;
  // Messages
  AddMessage(text: string): void;
  AddPrivateMessage(text: string, to: string): void;
  // Rooms
  AddRoom(room: string): void;
  RejoinRoom(room: string): void;
  //disconnecting
}

interface IServerToClientEvents {
  // Users
  GetOnline(online: []): void;
  ShowOnline(user: string): void;
  ShowOffline(user: string): void;
  // Messages
  AddMessage(message: IMessage): void;
  AddPrivateMessage(message: IMessage): void;
  FailedPrivateMessage(feedback: string): void;
  // Rooms
  GetUser(users: [], roomToAdd: string): void;
  RegetUser(users: [], roomToRejoin: string): void;
  AddUser(user: string): void;
  RemoveUser(user: string): void;
}