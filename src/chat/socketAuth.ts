'use strict';

import { NextFunction } from 'express';
import cookie from 'cookie';
import cookieParser from 'cookie-parser';
import { Server, Socket } from 'socket.io';

import { pubClient } from '../lib/connections/redisConnection';
import { MessengerUser } from '../redis-access/MessengerUser';

export function sessionIdsAreEqual(socket: ) {
  const parsedCookie = cookie.parse(socket.request.headers.cookie);
  const sid = cookieParser.signedCookie(
    parsedCookie['connect.sid'],
    process.env.SESSION_SECRET!
  );
  return parsedCookie['connect.sid'] === sid ? false : sid;
}

export function addMessengerUser(socket: Socket, sid: string, session: ) {
  socket.request.sid = sid;
  socket.request.userInfo = session.userInfo;
  const messengerUser = new MessengerUser(pubClient);
  messengerUser.addUser(
    session.userInfo.userId,
    session.userInfo.username,
    session.userInfo.avatar,
    sid,
    socket.id
  );
}

export function useSocketAuth(io: Server, redisSession: ) {
  function socketAuth(socket: Socket, next: NextFunction) {
    const sid = sessionIdsAreEqual(socket);

    if (sid === false) return next(new Error('Not authenticated.'));

    redisSession.get(sid, function(err: , session: ) {
      if (!session.userInfo.userId) return next(new Error('Not authenticated.'));
      addMessengerUser(socket, sid, session);
      return next();
    });
  }

  io.use(socketAuth);
}