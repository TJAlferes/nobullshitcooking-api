'use strict';

import { RedisStore } from 'connect-redis';
import cookie from 'cookie';
import cookieParser from 'cookie-parser';
import { Server as HTTPServer } from 'http';
import { Pool } from 'mysql2/promise';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { createAdapter } from 'socket.io-redis';

import { Friendship, User } from '../../access/mysql';
import { MessageStore, RoomStore, UserStore } from '../../access/redis';
import { RedisClients } from '../../app';
import { ChatUser } from '../../chat/entities/ChatUser';
import {
  addMessage,
  addPrivateMessage,
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
        allowedHeaders: ["sid", "userInfo"],
        credentials: true,
        methods: ["GET", "POST"],
        origin: ["https://nobullshitcooking.com", "http://localhost:8080"]
      },
      pingTimeout: 60000
    }
  );
  const { pubClient, subClient } = redisClients;  //pubClient.duplicate()

  io.adapter(createAdapter({pubClient, subClient}));

  io.use(async function(socket: Socket, next: Next) {
    const parsedCookie = cookie.parse(socket.request.headers.cookie!);
    const sessionId = cookieParser.signedCookie(
      parsedCookie['connect.sid'],
      process.env.SESSION_SECRET!
    );

    if (!sessionId || parsedCookie['connect.sid'] === sessionId)
      return next(new Error('Not authenticated.'));

    redisSession.get(sessionId, function(err, session) {
      if (!session || !session.userInfo || !session.userInfo.id)
        return next(new Error('Not authenticated.'));
      
      socket.request.sessionId = sessionId;
      socket.request.userInfo = session.userInfo;

      const { id, username } = session.userInfo;
      const userStore = new UserStore(pubClient);
      userStore.add(id, username, sessionId, socket.id);
      
      return next();
    });
  });

  io.on('connection', async function(socket: Socket) {
    const { id, username } = socket.request.userInfo;
    const chatUser = ChatUser(id, username);

    const user = new User(pool);
    const friendship = new Friendship(pool);

    const userStore = new UserStore(pubClient);
    const roomStore = new RoomStore(pubClient, subClient);
    const messageStore = new MessageStore(pubClient);

    // Users

    // TO DO: no longer appear online for users blocked and friends deleted
    // during that same session (so emit ShowOffline)
    
    socket.on('GetOnline', async function() {  // TO DO: rename
      await getOnline({id, username, socket, userStore, friendship});
    });

    socket.on('GetUser', async function(room: string) {
      await getUser({room, socket, roomStore});
    });

    // Messages

    socket.on('AddMessage', async function(text: string) {
      await addMessage({text, id, username, socket, messageStore});
    });

    socket.on('AddPrivateMessage', async function(text: string, to: string) {
      await addPrivateMessage({
        text, to, id, username, socket, userStore, friendship, user
      });
    });

    // Rooms

    socket.on('AddRoom', async function(room: string) {
      await addRoom({room, username, socket, roomStore});
    });

    socket.on('RejoinRoom', async function(room: string) {
      await rejoinRoom({room, username, socket, roomStore});
    });

    // SocketIO events

    socket.on('error', (error: Error) => console.log('error: ', error));

    socket.on('disconnecting', async function(reason: string) {
      await disconnecting({
        reason, username, socket, roomStore, chatUser, friendship
      });
    });

    socket.on('disconnect', async function(/*reason: string*/) {
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
  sessionId?: string;
  userId?: string;
  username?: string;
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