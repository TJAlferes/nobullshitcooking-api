import { Socket } from 'socket.io';

import { IChatStore } from '../access/redis';

export async function rejoinRoom({ room, username, socket, chatStore }: IRejoinRoom) {
  if (room === '') return;

  socket.join(room);
  chatStore.createRoom(room);
  chatStore.addUserToRoom(username, room);
  socket.broadcast.to(room).emit('UserJoinedRoom', username);

  const users = await chatStore.getUsersInRoom(room);
  socket.emit('UsersInRoomRefetched', users, room);
}

interface IRejoinRoom {
  room:      string;
  username:  string;
  socket:    Socket;
  chatStore: IChatStore;
}