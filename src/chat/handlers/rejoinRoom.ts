import { Socket } from 'socket.io';

import { IMessengerRoom } from '../../redis-access/MessengerRoom';
import { ChatUser } from '../entities/ChatUser';

export async function rejoinRoom({
  room,
  id,
  username,
  avatar,
  socket,
  messengerRoom
}: IRejoinRoom) {
  if (room === '') return;
  
  socket.join(room);

  await messengerRoom.addRoom(room);  // ?
  await messengerRoom.addUserToRoom(id, room);

  socket.broadcast.to(room).emit('AddUser', ChatUser(id, username, avatar));

  const users = await messengerRoom.getUsersInRoom(room);
  
  socket.emit('RegetUser', users, room);
}

interface IRejoinRoom {
  room: string;
  id: number;
  username: string;
  avatar: string;
  socket: Socket;
  messengerRoom: IMessengerRoom;
}