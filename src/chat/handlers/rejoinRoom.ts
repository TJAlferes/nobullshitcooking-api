import { Socket } from 'socket.io';

import { IMessengerRoom } from '../../access/redis/MessengerRoom';
import { ChatUser } from '../entities/ChatUser';

export async function rejoinRoom({
  room,
  username,
  avatar,
  socket,
  messengerRoom
}: IRejoinRoom) {
  if (room === '') return;

  socket.join(room);

  await messengerRoom.add(room);  // ?

  await messengerRoom.addUser(username, room);

  socket.broadcast.to(room).emit('AddUser', ChatUser(username, avatar));

  const users = await messengerRoom.getUsers(room);
  
  socket.emit('RegetUser', users, room);
}

interface IRejoinRoom {
  room: string;
  username: string;
  avatar: string;
  socket: Socket;
  messengerRoom: IMessengerRoom;
}