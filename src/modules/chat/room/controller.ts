import type { Socket } from 'socket.io';

import { ChatroomUser }     from './user/model';
import { ChatroomUserRepo } from './user/repo';
import { Chatroom }         from './model';
import { ChatroomRepo }     from './repo';

export const chatroomController = {
  async joinRoom({ room, sessionId, username, socket }: JoinRoomParams) {
    if (room === '') return;
  
    const chatroomUserRepo = new ChatroomUserRepo();
    const chatroomRepo     = new ChatroomRepo();

    const currentRooms = socket.rooms;
    for (const currentRoom in currentRooms) {
      if (currentRoom !== sessionId) {
        socket.leave(currentRoom);
        chatroomUserRepo.removeUserFromChatroom({user_id, chatroom_id});
        socket.broadcast.to(currentRoom).emit('UserLeftRoom', username);
      }
    }
  
    socket.join(room);
    chatroomRepo.create(chatroomName);
    chatroomUserRepo.addUserToChatroom({user_id, chatroom_id});
    socket.broadcast.to(room).emit('UserJoinedRoom', username);
  
    const users = await chatroomUserRepo.viewUsersInChatroom(chatroomName);
    socket.emit('UsersInroom', users, room);
  },

  async rejoinRoom({ room, username, socket }: RejoinRoomParams) {
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

type JoinRoomParams = {
  room:      string;
  sessionId: string;
  username:  string;
  socket:    Socket;
};

type RejoinRoomParams = {
  room:     string;
  username: string;
  socket:   Socket;
};
