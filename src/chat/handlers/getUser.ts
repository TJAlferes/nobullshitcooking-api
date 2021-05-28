import { Socket } from 'socket.io';

import { IRoomStore } from '../../access/redis';

export async function getUser({ room, socket, roomStore, }: IGetUser) {
  const users = await roomStore.getUsers(room);
  socket.emit('GetUser', users);
}

interface IGetUser {
  room: string;
  socket: Socket;
  roomStore: IRoomStore;
}