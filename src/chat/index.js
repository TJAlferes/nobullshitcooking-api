'use strict';

const client = require('../lib/connections/');
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
  socket.on('GetMe', function() {
    const user = socket.request.user.id;  // change
    const name = socket.request.user.displayname;  // change
    socket.emit('GetMe', User(user, name));
  });

  socket.on('GetUser', async function(room) {
    const messengerRoom = new MessengerRoom(client);
    const users = await messengerRoom.getUsersInRoom(room.room)
    socket.emit('GetUser', users);
  });  // change to 'GetUsers' ?



  socket.on('GetChat', function(data) {

  });

  socket.on('AddChat', function(chat) {

  });



  socket.on('GetRoom', function() {

  });

  socket.on('AddRoom', function(r) {
    
  });



  socket.on('disconnect', function() {});
};

module.exports = socketConnection;