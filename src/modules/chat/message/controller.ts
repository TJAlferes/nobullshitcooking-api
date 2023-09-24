import { Socket } from 'socket.io';

import { FriendshipRepo }  from '../../user/friendship/repo';
import { UserRepo }        from '../../user/repo';
import { Chatmessage }     from './model';
import { ChatMessageRepo } from './repo';

export const chatmessageController = {
  async sendMessage({ chatroom_id, sender_id, content, sessionId, socket }: SendMessageParams) {
    const chatmessage = Chatmessage.create({chatroom_id, sender_id, content}).getDTO();

    const { insert } = new ChatMessageRepo();
    await insert(chatmessage);
  
    socket.broadcast.to(chatroom_id).emit('Message', chatmessage);
    socket.emit('Message', chatmessage);
  },

  async sendPrivateMessage({ receiver_id, sender_id, content, socket }: SendPrivateMessageParams) {
    // check if receiver even exists
    const userRepo = new UserRepo();
    const receiver = await userRepo.getByUserId(receiver_id);
    if (!receiver) return socket.emit('FailedPrivateMessage', 'User not found.');

    // check if sender is blocked by receiver
    const { viewAllOfStatus } = new FriendshipRepo();
    const blockedUsers = await viewAllOfStatus({user_id: receiver.user_id, status: "blocked"});
    const blockedByReceiver = blockedUsers.find(u => u.user_id === sender_id);
    if (blockedByReceiver) return socket.emit('FailedPrivateMessage', 'User not found.');

    const chatmessage = Chatmessage.create({receiver_id, sender_id, content}).getDTO();

    const { insert } = new ChatMessageRepo();
    await insert(chatmessage);

    //do you need to check if they're online?
    //const onlineReceiver = await chatStore.getUserSessionId(receiver.username);
    //if (onlineReceiver) socket.broadcast.to(onlineReceiver).emit('PrivateMessage', chatmessage);
    socket.broadcast.to(onlineReceiver).emit('PrivateMessage', chatmessage);
    socket.emit('PrivateMessage', chatmessage);
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
