'use strict';

import cookie from 'cookie';
import cookieParser from 'cookie-parser';
import { RedisStore } from 'connect-redis';
//import { NextFunction } from 'express';  // OLD
import { Redis } from 'ioredis';
import { Server, Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';  // NEW

import { MessengerUser } from '../access/redis/MessengerUser';

export async function addMessengerUser(
  pubClient: Redis,
  socket: Socket,
  sid: string,
  session: Express.SessionData
) {
  const { username, avatar } = session.userInfo;

  //socket.request.sid = sid;                    // OLD (now read-only)
  //socket.request.userInfo = session.userInfo;  // OLD (now read-only)
  socket.handshake.query = {sid, userInfo: session.userInfo};  // NEW

  const messengerUser = new MessengerUser(pubClient);

  await messengerUser.add(username, avatar, sid, socket.id);
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
    const sid = sessionIdsAreEqual(socket);

    if (sid === false) return next(new Error('Not authenticated.'));

    redisSession.get(sid, async function(err, session) {
      if (!session || !session.userInfo.username) {
        return next(new Error('Not authenticated.'));
      }

      await addMessengerUser(pubClient, socket, sid, session);

      return next();
    });
  }

  io.use(socketAuth);
}