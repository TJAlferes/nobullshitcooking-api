import { Socket } from 'socket.io';

import { IMessengerRoom } from '../../redis-access/MessengerRoom';
import { ChatUser } from '../entities/ChatUser';

export async function addRoom({
  room,
  id,
  username,
  avatar,
  socket,
  messengerRoom
}: IAddRoom) {
  if (room === '') return;
  const currentRooms = socket.rooms;

  // change to array and change to for of?
  for (let currentRoom in currentRooms) {
    if (currentRooms[currentRoom] !== socket.id) {
      socket.leave(currentRooms[currentRoom]);

      messengerRoom.removeUserFromRoom(id, currentRooms[currentRoom]);

      socket.broadcast.to(currentRooms[currentRoom])
        .emit('RemoveUser', ChatUser(id, username, avatar));
    }
  }

  socket.join(room);

  await messengerRoom.addRoom(room);  // ???
  await messengerRoom.addUserToRoom(id, room);

  socket.broadcast.to(room)
    .emit('AddUser', ChatUser(id, username, avatar));

  const users = await messengerRoom.getUsersInRoom(room);

  socket.emit('GetUser', users, room);
}

interface IAddRoom {
  room: string;
  id: number;
  username: string;
  avatar: string;
  socket: Socket;
  messengerRoom: IMessengerRoom;
}