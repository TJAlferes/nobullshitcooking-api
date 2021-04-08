import { Socket } from 'socket.io';

import { IMessengerRoom } from '../../access/redis/MessengerRoom';

export async function addRoom({
  room,
  username,
  socket,
  messengerRoom
}: IAddRoom) {
  if (room === '') return;

  const currentRooms = socket.rooms;

  // change to array and change to for of?
  for (let currentRoom in currentRooms) {
    if (currentRoom !== socket.id) {
      socket.leave(currentRoom);

      messengerRoom.removeUser(username, currentRoom);

      socket.broadcast.to(currentRoom).emit('RemoveUser', username);
    }
  }

  socket.join(room);

  await messengerRoom.add(room);  // ???

  await messengerRoom.addUser(username, room);

  socket.broadcast.to(room).emit('AddUser', username);

  const users = await messengerRoom.getUsers(room);
  
  socket.emit('GetUser', users, room);
}

interface IAddRoom {
  room: string;
  username: string;
  socket: Socket;
  messengerRoom: IMessengerRoom;
}