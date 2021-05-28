import { Socket } from 'socket.io';

import { IRoomStore } from '../../access/redis';

export async function addRoom({
  room,
  id,
  username,
  socket,
  roomStore
}: IAddRoom) {
  if (room === '') return;

  const currentRooms = socket.rooms;
  // change to array and change to for of?
  for (const currentRoom in currentRooms) {
    if (currentRoom !== socket.id) {
      socket.leave(currentRoom);
      roomStore.removeUser(id, currentRoom);
      socket.broadcast.to(currentRoom).emit('RemoveUser', id);
    }
  }

  socket.join(room);
  await roomStore.add(room);  // ???
  await roomStore.addUser(id, room);
  socket.broadcast.to(room).emit('AddUser', {id, username});

  const users = await roomStore.getUsers(room);
  socket.emit('GetUser', users, room);
}

interface IAddRoom {
  room: string;
  id: number;
  username: string;
  socket: Socket;
  roomStore: IRoomStore;
}