'use strict';

const { pubClient, subClient } = require('../lib/connections/redisConnection');
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



async function removeAllRooms(socket, cb) {
  const current = socket.rooms;
  const len = Object.keys(current).length;
  let i = 0;
  for (let r in current) {  // ?????????????????????? *********************
    if (current[r] !== socket.id) {
      const user = socket.request.userInfo.userId;
      const name = socket.request.userInfo.username;
      socket.leave(current[r]);
      const messengerRoom = new MessengerRoom(pubClient);
      await messengerRoom.removeUserFromRoom(user, current[r]);  // WILL THIS WORK IN LOOP?
      socket.broadcast.to(current[r]).emit('RemoveUser', User(user, name));  // change?
    }
    i++;
    if (i === len) cb();
  }
}



const socketConnection = function(socket) {
  socket.on('GetMe', function() {
    const user = socket.request.userInfo.userId;
    const name = socket.request.userInfo.username;
    socket.emit('GetMe', User(user, name));
  });

  socket.on('GetUser', async function(room) {
    const messengerRoom = new MessengerRoom(subClient);
    const users = await messengerRoom.getUsersInRoom(room.room);  // O.o
    socket.emit('GetUser', users);
  });  // change to 'GetUsers' ?



  socket.on('GetChat', async function(data) {
    const messengerChat = new MessengerChat(subClient);
    await messengerChat.getChat(data.room, function(chats) {
      let retArr = [];
      let len = chats.length;
      chats.forEach(function(c) {
        try {
          retArr.push(JSON.parse(c));
        } catch (err) {
          console.error(err.message);
        }
        len--;
        if (len === 0) socket.emit('GetChat', retArr);
      });
    });
    // emit out here?
  });  // change to 'GetChats' ?

  socket.on('AddChat', async function(data) {
    const user = socket.request.userInfo.userId;
    const name = socket.request.userInfo.username;
    const chat = Chat(data.message, data.room, User(user, name));
    const messengerChat = new MessengerChat(pubClient);
    await messengerChat.addChat(chat);
    socket.broadcast.to(data.room).emit('AddChat', chat);
    socket.emit('AddChat', chat);
  });



  socket.on('GetRoom', async function() {
    const messengerRoom = new MessengerRoom(subClient);
    await messengerRoom.getRooms(function(rooms) {
      let retArr = [];
      let len = rooms.length;
      rooms.forEach(function(r) {
        retArr.push(Room(r));
        len--;
        if (len === 0) socket.emit('GetRoom', retArr);
      });
    });
  });  // change to 'GetRooms' ?

  socket.on('AddRoom', async function(r) {
    const room = r.name;
    await removeAllRooms(socket, function() {
      if (room !== '') {
        const user = socket.request.userInfo.userId;
        const name = socket.request.userInfo.username;
        const messengerRoom = new MessengerRoom(pubClient);
        socket.join(room);
        await messengerRoom.addRoom(room);  // WILL THIS WORK IN LOOP?
        //socket.broadcast.to(room).emit('AddUser', User(user, name));
        socket.to(room).emit('AddUser', User(user, name));
        await messengerRoom.addUserToRoom(user, room);  // WILL THIS WORK IN LOOP?
      }
    });
  });



  socket.on('disconnect', async function() {
    await removeAllRooms(socket, function() {});
  });
};

module.exports = socketConnection;