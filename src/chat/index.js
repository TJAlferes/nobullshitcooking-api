'use strict';

const { pubClient, subClient } = require('../lib/connections/redisConnection');
const MessengerChat = require('../redis-access/MessengerChat');
const MessengerRoom = require('../redis-access/MessengerRoom');

const User = (id, name) => ({id, user: name});

const Chat = (messageToAdd, room, user) => ({
  id: user.id + (new Date).getTime().toString(),
  ts: (new Date).getTime(),
  message: messageToAdd,
  room,
  user
});

const socketConnection = function(socket) {
  socket.on('GetUser', async function(room) {
    const messengerRoom = new MessengerRoom(pubClient, subClient);
    const users = await messengerRoom.getUsersInRoom(room);
    socket.emit('GetUser', users);
  });

  socket.on('AddChat', async function(messageToAdd) {
    const user = socket.request.userInfo.userId;
    const name = socket.request.userInfo.username;
    const room = Object.keys(socket.rooms).filter(r => r !== socket.id);
    const chat = Chat(messageToAdd, room, User(user, name));
    const messengerChat = new MessengerChat(pubClient);

    await messengerChat.addChat(chat);
    socket.broadcast.to(room).emit('AddChat', chat);
    socket.emit('AddChat', chat);
  });

  socket.on('AddRoom', async function(roomToAdd) {
    const currentRooms = socket.rooms;
    const user = socket.request.userInfo.userId;
    const name = socket.request.userInfo.username;
    const messengerRoom = new MessengerRoom(pubClient, subClient);

    for (let room in currentRooms) {
      if (currentRooms[room] !== socket.id) {
        socket.leave(currentRooms[room]);
        messengerRoom.removeUserFromRoom(user, currentRooms[room]);
        socket.broadcast.to(currentRooms[room]).emit('RemoveUser', User(user, name));
      }
    }

    if (roomToAdd !== '') {
      const user = socket.request.userInfo.userId;
      const name = socket.request.userInfo.username;
      socket.join(roomToAdd);

      await messengerRoom.addRoom(roomToAdd);
      await messengerRoom.addUserToRoom(user, roomToAdd);
      socket.broadcast.to(roomToAdd).emit('AddUser', User(user, name));

      const users = await messengerRoom.getUsersInRoom(roomToAdd);
      socket.emit('GetUser', users, roomToAdd);
    }
  });

  socket.on('disconnecting', async function() {
    const clonedSocket = {...socket};
    const user = socket.request.userInfo.userId;
    const name = socket.request.userInfo.username;
    const messengerRoom = new MessengerRoom(pubClient, subClient);

    for (let room in clonedSocket.rooms) {
      if (room !== clonedSocket.id) {
        socket.broadcast.to(room).emit('RemoveUser', User(user, name));
        messengerRoom.removeUserFromRoom(user, room);
      }
    }
  });
};

module.exports = socketConnection;