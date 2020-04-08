import { ChatUser  } from '../entities/ChatUser';

export async function addRoom(
  socket,
  messengerRoom,
  userId: number,
  username: string,
  avatar: string,
  room: string
) {
  if (room === '') return;
  const currentRooms = socket.rooms;

  // change to array and change to for of?
  for (let currentRoom in currentRooms) {
    if (currentRooms[currentRoom] !== socket.id) {
      socket.leave(currentRooms[currentRoom]);

      messengerRoom.removeUserFromRoom(userId, currentRooms[currentRoom]);

      socket.broadcast.to(currentRooms[currentRoom])
      .emit('RemoveUser', User(userId, username, avatar));
    }
  }

  socket.join(room);

  await messengerRoom.addRoom(room);
  await messengerRoom.addUserToRoom(userId, room);

  socket.broadcast.to(room)
  .emit('AddUser', ChatUser(userId, username, avatar));

  const users = await messengerRoom.getUsersInRoom(room);

  socket.emit('GetUser', users, room);
}