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
import { ChatStore } from '../../access/redis';
import { RedisClients } from '../../app';
import {
  sendMessage,
  sendPrivateMessage,
  joinRoom,
  disconnecting,
  getOnlineFriends,
  getUsersInRoom,
  rejoinRoom,
  IMessage
} from '../../chat';

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
        allowedHeaders: ["sessionId", "userInfo"],
        credentials: true,
        methods: ["GET", "POST"],
        origin: ["https://nobullshitcooking.com", "http://localhost:3000"]
      },
      pingTimeout: 60000
    }
  );
  const { pubClient, subClient } = redisClients;  //pubClient.duplicate()

  io.adapter(createAdapter({pubClient, subClient}));

  io.use(async (socket: IUberSocket, next: Next) => {
    const parsedCookie = cookie.parse(socket.request.headers.cookie!);
    const sessionId = cookieParser.signedCookie(
      parsedCookie['connect.sid'],
      process.env.SESSION_SECRET!
    );

    if (!sessionId || parsedCookie['connect.sid'] === sessionId)
      return next(new Error('Not authenticated.'));

    redisSession.get(sessionId, (err, session) => {
      if (!session || !session.userInfo || !session.userInfo.id)
        return next(new Error('Not authenticated.'));
      
      socket.sessionId = sessionId;
      socket.userInfo = session.userInfo;

      const { username } = session.userInfo;
      const chatStore = new ChatStore(pubClient);
      chatStore.createUser({username, sessionId, socketId: socket.id});
      
      return next();
    });
  });

  io.on('connection', async (socket: IUberSocket) => {
    const { id, username } = socket.userInfo!;
    if (!id || !username) return;

    const user = new User(pool);
    const friendship = new Friendship(pool);
    const chatStore = new ChatStore(pubClient);

    // Users

    // TO DO: no longer appear online for users blocked and friends deleted
    // during that same session (so emit ShowOffline)
    socket.on('GetOnlineFriends', async () => {
      await getOnlineFriends({id, username, socket, chatStore, friendship});
    });

    socket.on('GetUsersInRoom', async (room) => {
      await getUsersInRoom({room, socket, chatStore});
    });

    // Messages

    socket.on('SendMessage', async (text: string) => {
      await sendMessage({from: username, text, socket, chatStore});
    });

    socket.on('SendPrivateMessage', async (text: string, to: string) => {
      await sendPrivateMessage({
        to, from: username, text, socket, chatStore, friendship, user
      });
    });

    // Rooms

    socket.on('JoinRoom', async (room: string) => {
      await joinRoom({room, username, socket, chatStore});
    });

    socket.on('RejoinRoom', async (room: string) => {
      await rejoinRoom({room, username, socket, chatStore});
    });

    // SocketIO events

    socket.on('error', (error: Error) => console.log('error: ', error));

    socket.on('disconnecting', async (reason: string) => {
      //console.log('disconnect reason: ', reason);
      await disconnecting({id, username, socket, chatStore, friendship});
    });

    /*socket.on('disconnect', async (reason: string) => {
      console.log('disconnect reason: ', reason);
      const matchingSockets = await io.in(userId).allSockets();
      const disconnected = matchingSockets.size === 0;
      if (disconnected) {
        socket.broadcast.emit('user disconnected', userId);
        sessionStore.save(sessionId, {userId, username, connected: "false"});
      }
    });*/
  });
}

type Next = (err?: ExtendedError | undefined) => void;

interface IUberSocket extends Socket {
  sessionId?: string;
  userInfo?: {
    id?: number;
    username?: string;
  }
}

interface IClientToServerEvents {
  // Users
  GetOnlineFriends(): void;
  GetUsersInRoom(room: string): void;
  // Messages
  SendMessage(text: string): void;
  SendPrivateMessage(text: string, to: string): void;
  // Rooms
  JoinRoom(room: string): void;
  RejoinRoom(room: string): void;
  //disconnecting
}

interface IServerToClientEvents {
  // Users
  OnlineFriends(onlineFriends: string[]): void;
  FriendCameOnline(friend: string): void;
  FriendWentOffline(friend: string): void;
  // Messages
  Message(message: IMessage): void;
  PrivateMessage(message: IMessage): void;
  FailedPrivateMessage(feedback: string): void;
  // Rooms
  UsersInRoom(users: string[], room: string): void;
  UsersInRoomRefetched(users: string[], room: string): void;
  UserJoinedRoom(user: string): void;
  UserLeftRoom(user: string): void;
}