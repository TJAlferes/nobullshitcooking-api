async function rejoinRoom(
  socket,
  User,
  messengerRoom,
  userId,
  username,
  avatar,
  room
) {
  if (room !== '') {
    socket.join(room);

    await messengerRoom.addRoom(room);
    await messengerRoom.addUserToRoom(userId, room);

    socket.broadcast.to(room)
    .emit('AddUser', User(userId, username, avatar));

    const users = await messengerRoom.getUsersInRoom(room);
    
    socket.emit('RegetUser', users, room);
  }
};

module.exports = rejoinRoom;