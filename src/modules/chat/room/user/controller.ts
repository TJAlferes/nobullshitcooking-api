import { Socket } from 'socket.io';

import { ChatroomRepo }     from '../repo';
import { ChatroomUser }     from './model';
import { ChatroomUserRepo } from './repo';

export function chatroomUserController(socket: Socket) {
  return {
    async getUsersInRoom(chatroom_id: string) {
      const repo = new ChatroomUserRepo();
      const users = await repo.viewByChatroomId(chatroom_id);
      socket.emit('UsersInRoom', users);
    },

    async join({ chatroom_name, session_id, user_id, username }: JoinParams) {
      if (!chatroom_name) return;

      const chatroomRepo = new ChatroomRepo();
      const chatroom_id = await chatroomRepo.viewByChatroomName(chatroom_name);

      const chatroomUser = ChatroomUser.create({user_id, chatroom_id}).getDTO();
      const chatroomUserRepo = new ChatroomUserRepo();
      await chatroomUserRepo.insert(chatroomUser);

      socket.join(chatroom_id);
      socket.broadcast.to(chatroom_id).emit('UserJoinedRoom', username);
    
      const users = await chatroomUserRepo.viewByChatroomId(chatroom_id);
      socket.emit('UsersInroom', users, chatroom_id);  // chatroom_name???
    },

    async rejoin({ chatroom_name, user_id, username }: RejoinParams) {
      if (!chatroom_name) return;

      const chatroomRepo = new ChatroomRepo();
      const chatroom_id = await chatroomRepo.viewByChatroomName(chatroom_name);

      const chatroomUser = ChatroomUser.create({user_id, chatroom_id}).getDTO();
      const chatroomUserRepo = new ChatroomUserRepo();
      await chatroomUserRepo.insert(chatroomUser);

      socket.join(chatroom_id);
      socket.broadcast.to(chatroom_id).emit('UserJoinedRoom', username);
    
      const users = await chatroomUserRepo.viewByChatroomId(chatroom_id);
      socket.emit('UsersInRoomRefetched', users, chatroom_id);  // chatroom_name???
    }  // is this right??? it's just a duplicate of join
  };
}

type JoinParams = {
  chatroom_name: string;
  session_id:    string;
  user_id:       string;
  username:      string;
};

type RejoinParams = {
  chatroom_name: string;
  user_id:       string;
  username:      string;
};
