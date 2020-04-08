export async function getUser(
  socket,
  messengerRoom,
  room: string
) {
  const users = await messengerRoom.getUsersInRoom(room);
  socket.emit('GetUser', users);
}