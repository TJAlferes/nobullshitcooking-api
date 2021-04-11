'use strict';

import cookie from 'cookie';
import cookieParser from 'cookie-parser';
import { RedisStore } from 'connect-redis';
//import { NextFunction } from 'express';  // OLD
import { Redis } from 'ioredis';
import { Server, Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';  // NEW
import { v4 as uuidv4 } from 'uuid';

import { ChatUser } from '../access/redis/ChatUser';

export async function addChatUser(
  pubClient: Redis,
  socket: Socket,
  sid: string,
  session: Express.SessionData
) {
  const { username, avatar } = session.userInfo;

  //socket.request.sid = sid;                    // OLD (now read-only)
  //socket.request.userInfo = session.userInfo;  // OLD (now read-only)
  socket.handshake.query = {sid, userInfo: session.userInfo};  // NEW

  const chatUser = new ChatUser(pubClient);

  await chatUser.add(username, sid, socket.id);
}

export function sessionIdsAreEqual(socket: Socket) {
  const parsedCookie = cookie.parse(socket.request.headers.cookie!);  // ?

  const sid = cookieParser
    .signedCookie(parsedCookie['connect.sid'], process.env.SESSION_SECRET!);
  
  return parsedCookie['connect.sid'] === sid ? false : sid;
}

export function useSocketAuth(
  io: Server,
  pubClient: Redis,
  redisSession: RedisStore
) {
  function socketAuth(
    socket: Socket,
    next: (err?: ExtendedError | undefined) => void
  ) {
    const sessionId = socket.handshake.auth.sessionId;
    
    if (sessionId) {
      const session = sessionStore.findSession(sessionId);

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

    /*const sid = sessionIdsAreEqual(socket);

    if (sid === false) return next(new Error('Not authenticated.'));

    redisSession.get(sid, async function(err, session) {
      if (!session || !session.userInfo.username) {
        return next(new Error('Not authenticated.'));
      }

      await addChatUser(pubClient, socket, sid, session);

      return next();
    });*/
  }

  io.use(socketAuth);
}

