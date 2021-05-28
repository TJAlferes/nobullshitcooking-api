import { Socket } from 'socket.io';

import { IRoomStore } from '../../access/redis';

export async function rejoinRoom({
  room,
  id,
  username,
  socket,
  roomStore
}: IRejoinRoom) {
  if (room === '') return;

  socket.join(room);
  await roomStore.add(room);
  await roomStore.addUser(id, room);
  socket.broadcast.to(room).emit('AddUser', {id, username});

  const users = await roomStore.getUsers(room);
  socket.emit('RegetUser', users, room);
}

interface IRejoinRoom {
  room: string;
  id: number;
  username: string;
  socket: Socket;
  roomStore: IRoomStore;
}