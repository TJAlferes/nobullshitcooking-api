import { Socket } from 'socket.io';

import { IMessengerRoom } from '../../redis-access/MessengerRoom';

export async function getUser(
  socket: Socket,
  messengerRoom: IMessengerRoom,
  room: string
) {
  const users = await messengerRoom.getUsersInRoom(room);
  socket.emit('GetUser', users);
}