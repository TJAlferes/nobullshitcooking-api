import { Socket } from 'socket.io';

import { IChatRoom } from '../../access/redis/ChatRoom';

export async function rejoinRoom({
  room,
  username,
  socket,
  chatRoom
}: IRejoinRoom) {
  if (room === '') return;

  socket.join(room);

  await chatRoom.add(room);  // ?

  await chatRoom.addUser(username, room);

  socket.broadcast.to(room).emit('AddUser', username);

  const users = await chatRoom.getUsers(room);
  
  socket.emit('RegetUser', users, room);
}

interface IRejoinRoom {
  room: string;
  username: string;
  socket: Socket;
  chatRoom: IChatRoom;
}