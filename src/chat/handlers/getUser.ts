import { Socket } from 'socket.io';

import { IMessengerRoom } from '../../access/redis/MessengerRoom';

export async function getUser({ room, socket, messengerRoom, }: IGetUser) {
  const users = await messengerRoom.getUsers(room);
  socket.emit('GetUser', users);
}

interface IGetUser {
  room: string;
  socket: Socket;
  messengerRoom: IMessengerRoom;
}