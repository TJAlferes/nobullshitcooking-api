import { Socket } from 'socket.io';

import { IChatStore } from '../access/redis';

export async function rejoinRoom({ room, username, socket, chatStore }: IRejoinRoom) {
  if (room === '') return;

  socket.join(room);
  chatStore.createRoom(room);  // const chatroom = Chatroom.create(chatroomName); chatroomRepo.insert(chatroom);
  chatStore.addUserToRoom(username, room);  // const chatroomUser = chatroomUser.create({user_id, chatroom_id}); chatroomUserRepo.insert(chatroomUser);
  socket.broadcast.to(room).emit('UserJoinedRoom', username);

  const users = await chatStore.getUsersInRoom(room);
  socket.emit('UsersInRoomRefetched', users, room);
}

interface IRejoinRoom {
  room:      string;
  username:  string;
  socket:    Socket;
  chatStore: IChatStore;
}
