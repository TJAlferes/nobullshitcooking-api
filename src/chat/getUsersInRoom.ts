import { Socket } from 'socket.io';

import { IChatStore } from '../access/redis';

export async function getUsersInRoom({ room, socket, chatStore }: IGetUser) {
  const users = await chatStore.getUsersInRoom(room);
  socket.emit('UsersInRoom', users);
}

interface IGetUser {
  room: string;
  socket: Socket;
  chatStore: IChatStore;
}