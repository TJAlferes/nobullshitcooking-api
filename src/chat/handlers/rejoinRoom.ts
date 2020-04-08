import { ChatUser  } from '../entities/ChatUser';

export async function rejoinRoom(
  socket,
  messengerRoom,
  userId: number,
  username: string,
  avatar: string,
  room: string
) {
  if (room !== '') {
    socket.join(room);

    await messengerRoom.addRoom(room);
    await messengerRoom.addUserToRoom(userId, room);

    socket.broadcast.to(room)
    .emit('AddUser', ChatUser(userId, username, avatar));

    const users = await messengerRoom.getUsersInRoom(room);
    
    socket.emit('RegetUser', users, room);
  }
}