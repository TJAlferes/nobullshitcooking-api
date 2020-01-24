const cookie = require('cookie');
const cookieParser = require('cookie-parser');

const MessengerUser = require('../redis-access/MessengerUser');

const socketAuth = redisSession => (socket, next) => {
  const parsedCookie = cookie.parse(socket.request.headers.cookie);

  const sid = cookieParser.signedCookie(
    parsedCookie['connect.sid'],
    process.env.SESSION_SECRET
  );

  const socketid = socket.id;

  if (parsedCookie['connect.sid'] === sid) {
    return next(new Error('Not authenticated.'));
  }

  redisSession.get(sid, function(err, session) {
    if (session.userInfo.userId) {

      socket.request.userInfo = session.userInfo;
      socket.request.sid = sid;

      const messengerUser = new MessengerUser(pubClient);

      messengerUser.addUser(
        session.userInfo.userId,
        session.userInfo.username,
        session.userInfo.avatar,
        sid,
        socketid
      );

      return next();

    } else {

      return next(new Error('Not authenticated.'));
      
    }
  });
};

module.exports = socketAuth;