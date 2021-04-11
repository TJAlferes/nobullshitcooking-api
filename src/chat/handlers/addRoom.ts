import { Socket } from 'socket.io';

import { IChatRoom } from '../../access/redis/ChatRoom';

export async function addRoom({
  room,
  username,
  socket,
  chatRoom
}: IAddRoom) {
  if (room === '') return;

  const currentRooms = socket.rooms;

  // change to array and change to for of?
  for (let currentRoom in currentRooms) {
    if (currentRoom !== socket.id) {
      socket.leave(currentRoom);

      chatRoom.removeUser(username, currentRoom);

      socket.broadcast.to(currentRoom).emit('RemoveUser', username);
    }
  }

  socket.join(room);

  await chatRoom.add(room);  // ???

  await chatRoom.addUser(username, room);

  socket.broadcast.to(room).emit('AddUser', username);

  const users = await chatRoom.getUsers(room);
  
  socket.emit('GetUser', users, room);
}

interface IAddRoom {
  room: string;
  username: string;
  socket: Socket;
  chatRoom: IChatRoom;
}