const cookie = require('cookie');
const cookieParser = require('cookie-parser');

const MessengerUser = require('../redis-access/MessengerUser');
const { pubClient } = require('../lib/connections/redisConnection');

const sessionIdsAreEqual = socket => {
  const parsedCookie = cookie.parse(socket.request.headers.cookie);
  const sid = cookieParser.signedCookie(
    parsedCookie['connect.sid'],
    process.env.SESSION_SECRET
  );
  return parsedCookie['connect.sid'] === sid;
};

const addMessengerUser = (socket, sid, session) => {
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
};

const socketAuth = redisSession => (socket, next) => {
  if (!sessionIdsAreEqual(socket)) return next(new Error('Not authenticated.'));
  redisSession.get(sid, function(err, session) {
    if (!session.userInfo.userId) return next(new Error('Not authenticated.'));
    addMessengerUser(socket, sid, session);
  });
  return next();
};

module.exports = {
  sessionIdsAreEqual,
  addMessengerUser,
  socketAuth
};