'use strict';

import { NextFunction } from 'express';
import { RedisStore } from 'connect-redis';
import cookie from 'cookie';
import cookieParser from 'cookie-parser';
import { Server, Socket } from 'socket.io';

import { pubClient } from '../lib/connections/redisConnection';
import { MessengerUser } from '../redis-access/MessengerUser';

export async function addMessengerUser(
  socket: Socket,
  sid: string,
  session: Express.SessionData
) {
  socket.request.sid = sid;
  socket.request.userInfo = session.userInfo;

  const messengerUser = new MessengerUser(pubClient);

  await messengerUser.addUser(
    session.userInfo.userId,
    session.userInfo.username,
    session.userInfo.avatar,
    sid,
    socket.id
  );
}

export function sessionIdsAreEqual(socket: Socket) {
  const parsedCookie = cookie.parse(socket.request.headers.cookie); // ???
  const sid = cookieParser.signedCookie(
    parsedCookie['connect.sid'],
    process.env.SESSION_SECRET!
  );

  return parsedCookie['connect.sid'] === sid ? false : sid;
}

export function useSocketAuth(io: Server, redisSession: RedisStore) {
  function socketAuth(socket: Socket, next: NextFunction) {
    const sid = sessionIdsAreEqual(socket);

    if (sid === false) return next(new Error('Not authenticated.'));

    redisSession.get(sid, async function(err, session) {
      if (!session || !session.userInfo.userId) {
        return next(new Error('Not authenticated.'));
      }

      await addMessengerUser(socket, sid, session);
      
      return next();
    });
  }

  io.use(socketAuth);
}