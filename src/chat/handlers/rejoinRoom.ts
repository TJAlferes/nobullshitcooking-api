import { Socket } from 'socket.io';

import { IMessengerRoom } from '../../redis-access/MessengerRoom';
import { ChatUser } from '../entities/ChatUser';

export async function rejoinRoom({
  room,
  userId,
  username,
  avatar,
  socket,
  messengerRoom
}: IRejoinRoom) {
  if (room === '') return;
  
  socket.join(room);

  await messengerRoom.addRoom(room);  // ?
  await messengerRoom.addUserToRoom(userId, room);

  socket.broadcast.to(room)
  .emit('AddUser', ChatUser(userId, username, avatar));

  const users = await messengerRoom.getUsersInRoom(room);
  
  socket.emit('RegetUser', users, room);
}

interface IRejoinRoom {
  room: string;
  userId: number;
  username: string;
  avatar: string;
  socket: Socket;
  messengerRoom: IMessengerRoom;
}