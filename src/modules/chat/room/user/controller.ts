import { Socket } from 'socket.io';

import { ChatroomUserRepo } from './repo';

export const chatroomUserController = {
  async getUsersInRoom({ chatroom_id, socket }: GetUsersInRoomParams) {
    const repo = new ChatroomUserRepo();
    const users = await repo.viewByChatroomId(chatroom_id);
    socket.emit('UsersInRoom', users);
  }
};

type GetUsersInRoomParams = {
  //room:   string;
  chatroom_id: string;
  socket:      Socket;  // not UberSocket?
};
