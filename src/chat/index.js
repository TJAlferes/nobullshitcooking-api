'use strict';

const client = require('../lib/connections/redisConnection');
const MessengerChat = require('../redis-access/MessengerChat');
const MessengerRoom = require('../redis-access/MessengerRoom');



const User = (id, name) => ({id, user: name});  // change

const Chat = (message, room, user) => ({
  id: user.id + (new Date).getTime().toString(),
  ts: (new Date).getTime(),
  message,
  room,
  user
});

const Room = name => ({id: name, name});



function removeFromRoom(socket, room) {
  const user = socket.request.user.id;  // change
  const name = socket.request.user.displayname;  // change
  socket.leave(room);
  const messengerRoom = new MessengerRoom(client);
  messengerRoom.removeUserFromRoom(user, room);
  socket.broadcast.to(room).emit('RemoveUser', User(user, name))
}

function removeAllRooms(socket, cb) {
  const current = socket.rooms;
  const len = Object.keys(current).length;
  let i = 0;
  for (let r in current) {
    if (current[r] !== socket.id) removeFromRoom(socket, current[r]);
    i++;
    if (i === len) cb();
  }
}



const socketConnection = function(socket) {
  socket.auth = false;

  socket.on('authenticate', async function(socket, data) {
    try {
      const user = await verifyUser(data.token);  // send token to client, client sends token back here?
      //const user = {id: socket.handshake.session.userInfo.;
      const canConnect = await ioredis.setAsync(`users:${user.id}`, socket.id, 'NX', 'EX', 30);
      if (!canConnect) {
        return socket.emit('unauthorized', {message: 'ALREADY_LOGGED_IN'}, function() {
          if (socket.user) await ioredis.delAsync(`users:${socket.user.id}`);
        });
      }

      socket.user = user;
      socket.auth = true;

      io.nsps.forEach(function(nsp) {
        if (nsp.sockets.find(el => el.id === socket.id)) {
          nsp.connected[socket.id] = socket;
        }
      });

      socket.emit('authenticated', true);

      return async (socket) => {
        socket.conn.on('packet', async (packet) => {
          if (socket.auth && packet.type === 'ping') {
            await ioredis.setAsync(`users:${socket.user.id}`, socket.id, 'XX', 'EX', 30);
          }
        });
      };
    } catch (err) {
      if (err) {
        socket.emit('unauthorized', {message: err.message}, function() {
          if (socket.user) await ioredis.delAsync(`users:${socket.user.id}`);
        });
      } else {
        socket.emit('unauthorized', {message: 'Authentication failure'}, function() {
          if (socket.user) await ioredis.delAsync(`users:${socket.user.id}`);
        });
      }
    }
  });



  socket.on('GetMe', function() {
    const user = socket.request.user.id;  // change
    const name = socket.request.user.displayname;  // change
    socket.emit('GetMe', User(user, name));
  });

  socket.on('GetUser', async function(room) {
    const messengerRoom = new MessengerRoom(client);
    const users = await messengerRoom.getUsersInRoom(room.room);
    socket.emit('GetUser', users);
  });  // change to 'GetUsers' ?



  socket.on('GetChat', function(data) {
    const messengerChat = new MessengerChat(client);
    messengerChat.getChat(data.room, function(chats) {
      let retArr = [];
      let len = chats.length;
      chats.forEach(function(c) {
        try {
          retArr.push(JSON.parse(c));
        } catch (err) {
          console.log(err.message);
        }
        len--;
        if (len === 0) socket.emit('GetChat', retArr);
      });
    });
  });  // change to 'GetChats' ?

  socket.on('AddChat', function(chat) {
    const user = socket.request.user.id;  // change
    const name = socket.request.user.displayname;  // change
    const newChat = Chat(chat.message, chat.room, User(user, name));
    const messengerChat = new MessengerChat(client);
    messengerChat.addChat(newChat);
    socket.broadcast.to(chat.room).emit('AddChat', newChat);
    socket.emit('AddChat', newChat);
  });



  socket.on('GetRoom', function() {
    const messengerRoom = new MessengerRoom(client);
    messengerRoom.getRooms(function(rooms) {
      let retArr = [];
      let len = rooms.length;
      rooms.forEach(function(r) {
        retArr.push(Room(r));
        len--;
        if (len === 0) socket.emit('GetRoom', retArr);
      });
    });
  });  // change to 'GetRooms' ?

  socket.on('AddRoom', function(r) {
    const room = r.name;
    removeAllRooms(socket, function() {
      if (room !== '') {
        const user = socket.request.user.id;  // change
        const name = socket.request.user.displayname;  // change
        const messengerRoom = new MessengerRoom(client);
        socket.join(room);
        messengerRoom.addRoom(room);
        socket.broadcast.to(room).emit('AddUser', User(user, name));
        messengerRoom.addUserToRoom(user, room);
      }
    });
  });



  socket.on('disconnect', function() {
    removeAllRooms(socket, function() {});  // noop?
  });
  socket.on('disconnect', function(socket) {
    if (socket.user) await ioredis.delAsync(`users:${socket.user.id}`);
  });



  setTimeout(() => {
    if (!socket.auth) {
      if (socket.user) await ioredis.delAsync(`users:${socket.user.id}`);
    }
  }, 1000);
};

module.exports = socketConnection;