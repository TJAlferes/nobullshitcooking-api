import { Socket } from 'socket.io';

import { IChatStore } from '../access/redis';

export async function getUsersInRoom({ room, socket, chatStore }: IGetUser) {
  const users = await chatStore.getUsersInRoom(room);  // chatroomUserRepo.getUsersInChatroom(chatroomName);
  socket.emit('UsersInRoom', users);
}

interface IGetUser {
  room:      string;
  socket:    Socket;  // not UberSocket?
  chatStore: IChatStore;
}
