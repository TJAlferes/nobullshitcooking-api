import { Socket } from 'socket.io';

import { IMessengerRoom } from '../../redis-access/MessengerRoom';

export async function getUser({ room, socket, messengerRoom, }: IGetUser) {
  const users = await messengerRoom.getUsersInRoom(room);
  socket.emit('GetUser', users);
}

interface IGetUser {
  room: string;
  socket: Socket;
  messengerRoom: IMessengerRoom;
}