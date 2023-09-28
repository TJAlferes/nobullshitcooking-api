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
      const { chatroom_id } = chatroomRepo.viewByChatroomName(chatroom_name);

      const chatroomUserRepo = new ChatroomUserRepo();
      chatroomUserRepo.addUserToChatroom({user_id, chatroom_id});

      socket.join(chatroom_id);
      socket.broadcast.to(chatroom_id).emit('UserJoinedRoom', username);
    
      const users = await chatroomUserRepo.viewUsersInChatroom(chatroomName);
      socket.emit('UsersInroom', users, chatroom_id);
    },

    async rejoin({ room, username }: RejoinParams) {
      if (room === '') return;
    
      const chatroomUserRepo = new ChatroomUserRepo();
      //const chatroomRepo     = new ChatroomRepo();

      socket.join(room);
      //const chatroom = Chatroom.create(chatroomName);
      //chatroomRepo.insert(chatroom);
      //const chatroomUser = chatroomUser.create({user_id, chatroom_id});
      chatroomUserRepo.insert(chatroomUser);
      socket.broadcast.to(room).emit('UserJoinedRoom', username);
    
      const users = await chatroomUserRepo.getUsersInRoom(room);
      socket.emit('UsersInRoomRefetched', users, room);
    }
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
  username:      string;
};
