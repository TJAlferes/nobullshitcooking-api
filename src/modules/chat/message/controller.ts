import { Socket } from 'socket.io';

import { FriendshipRepo }  from '../../user/friendship/repo';
import { UserRepo }        from '../../user/repo';
import { ChatUserRepo }    from '../user/repo';
import { Chatmessage }     from './model';
import { ChatmessageRepo } from './repo';

export function chatmessageController(socket: Socket) {
  return {
    async viewByChatroomId(chatroom_id: string) {
      const repo = new ChatmessageRepo();

      const chatmessages = await repo.viewByChatroomId(chatroom_id);

      socket.emit('PrivateConversation', chatmessages);
    },

    async viewPrivateConversation({ sender_id, receiver_id }: ViewPrivateConversationParams) {
      const repo = new ChatmessageRepo();

      const chatmessages = await repo.viewPrivateConversation({sender_id, receiver_id});

      socket.emit('PrivateConversation', chatmessages);
    },
  
    async sendMessage({ chatroom_id, sender_id, content }: SendMessageParams) {
      const chatmessage = Chatmessage.create({chatroom_id, sender_id, content}).getDTO();
  
      const repo = new ChatmessageRepo();
      await repo.insert(chatmessage);
  
      socket.broadcast.to(chatroom_id).emit('Message', chatmessage);
      socket.emit('Message', chatmessage);
    },
  
    async sendPrivateMessage({ receiver_id, sender_id, content }: SendPrivateMessageParams) {
      // check if receiver even exists
      const userRepo = new UserRepo();
      const receiver = await userRepo.getByUserId(receiver_id);
      if (!receiver) return socket.emit('FailedPrivateMessage', 'User not found.');
  
      // check if sender is blocked by receiver
      const friendshipRepo = new FriendshipRepo();
      const blockedUsers = await friendshipRepo.viewAllOfStatus({user_id: receiver.user_id, status: "blocked"});
      const blockedByReceiver = blockedUsers.find(u => u.user_id === sender_id);
      if (blockedByReceiver) return socket.emit('FailedPrivateMessage', 'User not found.');
      
      const chatmessage = Chatmessage.create({receiver_id, sender_id, content}).getDTO();
  
      const chatmessageRepo = new ChatmessageRepo();
      await chatmessageRepo.insert(chatmessage);
  
      const chatuserRepo = new ChatUserRepo();
      const onlineReceiver = await chatuserRepo.getByUsername(receiver.username);
      if (onlineReceiver) {
        socket.broadcast.to(onlineReceiver.session_id).emit('PrivateMessage', chatmessage);
      }
      socket.emit('PrivateMessage', chatmessage);
    }
  };
}

type ViewPrivateConversationParams = {
  sender_id:   string;
  receiver_id: string;
};

type SendMessageParams = {
  chatroom_id: string;
  sender_id:   string;
  content:     string;
};

type SendPrivateMessageParams = {
  receiver_id: string;
  sender_id:   string;
  content:     string;
};
