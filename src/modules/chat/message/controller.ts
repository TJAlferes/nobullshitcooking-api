import { Socket } from 'socket.io';

import { FriendshipRepo }  from '../../user/friendship/repo';
import { UserRepo }        from '../../user/repo';
import { Chatmessage }     from './model';
import { ChatMessageRepo } from './repo';

export const chatmessageController = {
  async sendMessage({ chatroom_id, sender_id, content, sessionId, socket }: SendMessageParams) {
    const room = Object.keys(socket.rooms).find(r => r !== sessionId);
    if (!room) return;
  
    const chatmessage = Chatmessage.create({chatroom_id, sender_id, content}).getDTO();

    const { insert } = new ChatMessageRepo();
    await insert(chatmessage);
  
    socket.broadcast.to(room).emit('Message', message);
    socket.emit('Message', message);
  },

  async sendPrivateMessage({ receiver_id, sender_id, content, socket }: SendPrivateMessageParams) {
    const notFound = socket.emit('FailedPrivateMessage', 'User not found.');
  
    const userRepo = new UserRepo();
    const userExists = await userRepo.getByUserId(receiver_id);
    if (!userExists.length) return notFound;
    
    const { user_id, username } = userExists;

    const friendshipRepo = new FriendshipRepo();
    const blockedUsers = await friendshipRepo.viewAllOfStatus({user_id, status: "blocked"});
    const blockedByUser = blockedUsers.find(u => u.user_id === sender_id);
    if (blockedByUser) return notFound;
  
    const onlineUser = await chatStore.getUserSessionId(username);  // ???  // also, they don't need to be online to send them a private message
    if (!onlineUser) return notFound;
  
    const chatmessage = Chatmessage.create({receiver_id, sender_id, content}).getDTO();

    const { insert } = new ChatMessageRepo();
    await insert(chatmessage);

    socket.broadcast.to(onlineUser).emit('PrivateMessage', message);
    socket.emit('PrivateMessage', message);
  }
};

type SendMessageParams = {
  chatroom_id: string;
  sender_id:   string;
  content:     string;
  sessionId:   string;
  socket:      Socket;
};

type SendPrivateMessageParams = {
  receiver_id: string;
  sender_id:   string;
  content:     string;
  socket:      Socket;
};
