'use strict';

const { pubClient, subClient } = require('../lib/connections/redisConnection');
const MessengerChat = require('../redis-access/MessengerChat');
const MessengerRoom = require('../redis-access/MessengerRoom');

const User = (id, name) => ({id, user: name});  // change

const Chat = (messageToAdd, room, user) => ({
  id: user.id + (new Date).getTime().toString(),
  ts: (new Date).getTime(),
  message: messageToAdd,
  room,
  user
});

//const Room = name => ({id: name, name});

const socketConnection = function(socket) {
  socket.on('GetUser', async function(room) {
    const messengerRoom = new MessengerRoom(pubClient, subClient);
    const users = await messengerRoom.getUsersInRoom(room);
    socket.emit('GetUser', users);
  });

  socket.on('GetChat', async function(data) {
    const messengerChat = new MessengerChat(subClient);
    const chats = await messengerChat.getChat(data.room);
    let retArr = [];
    for (let chat in chats) {
      retArr.push(JSON(chat));
    }
    socket.emit('GetChat', retArr);
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

  /*socket.on('GetRoom', async function() {  // is this even needed? maybe only for staff?
    const messengerRoom = new MessengerRoom(pubClient, subClient);
    const rooms = await messengerRoom.getRooms();
    let retArr = [];
    for (let room in rooms) {
      retArr.push(Room(room));
    }
    socket.emit('GetRoom', retArr);
  });*/

  socket.on('AddRoom', async function(roomToAdd) {
    const currentRooms = socket.rooms;
    const messengerRoom = new MessengerRoom(pubClient, subClient);

    for (let room in currentRooms) {  // filter instead?
      if (currentRooms[room] !== socket.id) {
        const user = socket.request.userInfo.userId;
        const name = socket.request.userInfo.username;
        socket.leave(currentRooms[room]);

        messengerRoom.removeUserFromRoom(user, currentRooms[room]);
        socket.broadcast.to(currentRooms[room]).emit('RemoveUser', User(user, name));
      }
    }

    if (roomToAdd !== '') {  // how about null and undefined?
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
    const messengerRoom = new MessengerRoom(pubClient, subClient);
    const user = socket.request.userInfo.userId;
    const name = socket.request.userInfo.username;
    for (let room in clonedSocket.rooms) {
      if (room !== clonedSocket.id) {
        socket.broadcast.to(room).emit('RemoveUser', User(user, name));
        messengerRoom.removeUserFromRoom(user, room);
        //socket.leave(room);  // socket.io docs say not needed...
      }
    }
  });
};

module.exports = socketConnection;