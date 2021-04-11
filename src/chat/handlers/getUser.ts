import { Socket } from 'socket.io';

import { IChatRoom } from '../../access/redis/ChatRoom';

export async function getUser({ room, socket, chatRoom, }: IGetUser) {
  const users = await chatRoom.getUsers(room);
  socket.emit('GetUser', users);
}

interface IGetUser {
  room: string;
  socket: Socket;
  chatRoom: IChatRoom;
}