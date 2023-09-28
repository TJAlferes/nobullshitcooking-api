import type { Socket } from 'socket.io';
import { Request, Response } from 'express';

import { ChatgroupRepo }    from '../group/repo';
import { ChatroomUser }     from './user/model';
import { ChatroomUserRepo } from './user/repo';
import { Chatroom }         from './model';
import { ChatroomRepo }     from './repo';

export function chatroomController(socket: Socket) {
  return {
    async create(req: Request, res: Response) {
      const { chatgroup_id, chatroom_name } = req.body;
      const user_id = req.session.user_id!;

      const chatgroupRepo = new ChatgroupRepo();
      const owner_id = await chatgroupRepo.getOwnerId(chatgroup_id);
      if (user_id !== owner_id) {
        return res.status(403).end();
      }

      const chatroom = Chatroom.create({chatgroup_id, chatroom_name}).getDTO();
      const chatroomRepo = new ChatroomRepo();
      await chatroomRepo.insert(chatroom);
    },

    async delete(req: Request, res: Response) {
      const { chatgroup_id, chatroom_id } = req.body;
      const user_id = req.session.user_id!;

      const chatgroupRepo = new ChatgroupRepo();
      const owner_id = await chatgroupRepo.getOwnerId(chatgroup_id);
      if (user_id !== owner_id) {
        return res.status(403).end();
      }

      const chatroomRepo = new ChatroomRepo();
      await chatroomRepo.deleteOne(chatroom_id)
    },

    // move these to chatroomUserController???

    async join({ chatroom_name, session_id, user_id, username }: JoinParams) {
      if (!chatroom_name) return;

      const chatroomRepo = new ChatroomRepo();
      const chatroom = chatroomRepo.viewByChatroomName(chatroom_name);

      const chatroomUserRepo = new ChatroomUserRepo();
      chatroomUserRepo.addUserToChatroom({user_id, chatroom_id});

      socket.join(chatroom.chatroom_id);
      socket.broadcast.to(room).emit('UserJoinedRoom', username);
    
      const users = await chatroomUserRepo.viewUsersInChatroom(chatroomName);
      socket.emit('UsersInroom', users, room);
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

type CreateParams = {
  chatgroup_id:  string;
  chatroom_name: string;
};

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
