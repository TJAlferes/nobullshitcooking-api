import { Socket } from 'socket.io';

import { IChatStore } from '../access/redis';

export async function joinRoom({ room, username, socket, chatStore }: IJoinRoom) {
  if (room === '') return;

  const currentRooms = socket.rooms;
  // change to array and change to for of?
  for (const currentRoom in currentRooms) {
    if (currentRoom !== socket.id) {
      socket.leave(currentRoom);
      chatStore.removeUserFromRoom(username, currentRoom);
      socket.broadcast.to(currentRoom).emit('UserLeftRoom', username);
    }
  }

  socket.join(room);
  chatStore.createRoom(room);  // ?
  chatStore.addUserToRoom(username, room);
  socket.broadcast.to(room).emit('UserJoinedRoom', username);

  const users = await chatStore.getUsersInRoom(room);
  socket.emit('UsersInroom', users, room);
}

interface IJoinRoom {
  room: string;
  username: string;
  socket: Socket;
  chatStore: IChatStore;
}