const getUser = async function(socket, messengerRoom, room) {
  const users = await messengerRoom.getUsersInRoom(room);
  socket.emit('GetUser', users);
};

module.exports = getUser;