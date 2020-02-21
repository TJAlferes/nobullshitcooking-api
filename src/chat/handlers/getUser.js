async function getUser(socket, messengerRoom, room) {
  const users = await messengerRoom.getUsersInRoom(room);
  socket.emit('GetUser', users);
};

module.exports = getUser;