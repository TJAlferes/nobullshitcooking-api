import { Socket } from 'socket.io';

import { IMessengerRoom } from '../../access/redis/MessengerRoom';

export async function rejoinRoom({
  room,
  username,
  socket,
  messengerRoom
}: IRejoinRoom) {
  if (room === '') return;

  socket.join(room);

  await messengerRoom.add(room);  // ?

  await messengerRoom.addUser(username, room);

  socket.broadcast.to(room).emit('AddUser', username);

  const users = await messengerRoom.getUsers(room);
  
  socket.emit('RegetUser', users, room);
}

interface IRejoinRoom {
  room: string;
  username: string;
  socket: Socket;
  messengerRoom: IMessengerRoom;
}