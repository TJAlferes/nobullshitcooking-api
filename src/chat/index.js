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



/*async function removeAllRooms(socket, cb) {
  const current = socket.rooms;
  const len = Object.keys(current).length;
  let i = 0;
  for (let r in current) {
    if (current[r] !== socket.id) {
      const user = socket.request.userInfo.userId;
      const name = socket.request.userInfo.username;
      socket.leave(current[r]);
      let messengerRoom = new MessengerRoom(pubClient);
      messengerRoom.removeUserFromRoom(user, current[r]);
      socket.broadcast.to(current[r]).emit('RemoveUser', User(user, name));  // change?
    }
    i++;
    if (i === len) cb();
  }
}*/



const socketConnection = function(socket) {
  socket.on('GetMe', function() {
    const user = socket.request.userInfo.userId;
    const name = socket.request.userInfo.username;
    socket.emit('GetMe', User(user, name));
  });

  socket.on('GetUser', async function(room) {
    const messengerRoom = new MessengerRoom(pubClient, subClient);
    const users = await messengerRoom.getUsersInRoom(room);
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
    const messengerRoom = new MessengerRoom(pubClient, subClient);
    await messengerRoom.getRooms(function(rooms) {
      let retArr = [];
      let len = rooms.length;
      rooms.forEach(function(r) {
        retArr.push(Room(r));
        len--;
        if (len === 0) socket.emit('GetRoom', retArr);
        console.log('GET A ROOM!', retArr);
      });
    });
  });  // change to 'GetRooms' ?

  /*socket.on('AddRoom', async function(roomToAdd) {
    const messengerRoom = new MessengerRoom(pubClient, subClient);
    const currentRooms = socket.rooms;
    const len = Object.keys(currentRooms).length;
    let i = 0;
    for (let room in currentRooms) {
      if (currentRooms[room] !== socket.id) {
        const user = socket.request.userInfo.userId;
        const name = socket.request.userInfo.username;
        socket.leave(currentRooms[room]);
        messengerRoom.removeUserFromRoom(user, currentRooms[room]);
        socket.broadcast.to(currentRooms[room]).emit('RemoveUser', User(user, name));  // change?
      }
      i++;
      if (i === len) {
        if (roomToAdd !== '') {
          const user = socket.request.userInfo.userId;
          const name = socket.request.userInfo.username;
          socket.join(roomToAdd);
          await messengerRoom.addRoom(roomToAdd);
          //socket.broadcast.to(room).emit('AddUser', User(user, name));
          socket.to(roomToAdd).emit('AddUser', User(user, name));
          //socket.emit('AddUser', User(user, name));  // REMOVE!!!!!!!! JUST FOR TESING!!!!!!!!
          await messengerRoom.addUserToRoom(user, roomToAdd);
          const users = await messengerRoom.getUsersInRoom(roomToAdd);
          socket.emit('GetUser', users);  // .to(roomToAdd) ?
        }
      }
    }
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
        socket.broadcast.to(currentRooms[room]).emit('RemoveUser', User(user, name));  // change?
      }
    }
    if (roomToAdd !== '') {  // how about null and undefined?
      const user = socket.request.userInfo.userId;
      const name = socket.request.userInfo.username;
      socket.join(roomToAdd);
      await messengerRoom.addRoom(roomToAdd);
      //socket.broadcast.to(room).emit('AddUser', User(user, name));
      socket.to(roomToAdd).emit('AddUser', User(user, name));
      //socket.emit('AddUser', User(user, name));  // REMOVE!!!!!!!! JUST FOR TESING!!!!!!!!
      await messengerRoom.addUserToRoom(user, roomToAdd);
      const users = await messengerRoom.getUsersInRoom(roomToAdd);
      socket.emit('GetUser', users);  // .to(roomToAdd) ?
    }
  });



  socket.on('disconnect', async function() {
    const currentRooms = socket.rooms;
    for (let room in currentRooms) {
      if (currentRooms[room] !== socket.id) {
        const user = socket.request.userInfo.userId;
        const name = socket.request.userInfo.username;
        socket.leave(currentRooms[room]);
        let messengerRoom = new MessengerRoom(pubClient, subClient);
        messengerRoom.removeUserFromRoom(user, currentRooms[room]);
        socket.broadcast.to(currentRooms[room]).emit('RemoveUser', User(user, name));  // change?
      }
    }
  });
};

module.exports = socketConnection;