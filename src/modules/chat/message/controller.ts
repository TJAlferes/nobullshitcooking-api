import { Socket } from 'socket.io';

import { FriendshipRepo }  from '../../user/friendship/repo';
import { UserRepo }        from '../../user/repo';
import { Chatmessage }     from './model';
import { ChatMessageRepo } from './repo';

export const chatmessageController = {
  async sendMessage({ from, text, sessionId, socket }: SendMessageParams) {
    const room = Object.keys(socket.rooms).find(r => r !== sessionId);
    if (!room) return;
  
    const chatmessage = Chatmessage.create({chatroom_id, content});
    const { insert } = new ChatMessageRepo();
    await insert(chatmessage)
  
    socket.broadcast.to(room).emit('Message', message);
    socket.emit('Message', message);
  }

  async sendPrivateMessage({
    to,
    from,
    text,
    socket
  }: SendPrivateMessageParams) {
    const notFound = socket.emit('FailedPrivateMessage', 'User not found.');
  
    const userRepo = new UserRepo();
    const userExists = await user.getByName(to);
    if (!userExists.length) return notFound;
    
    const { id, username } = userExists;

    const friendshipRepo = new FriendshipRepo();
    const blockedUsers = await friendship.viewBlocked(id);
    const blockedByUser = blockedUsers.find((u: any) => u.username === from);
    if (blockedByUser) return notFound;
  
    const onlineUser = await chatStore.getUserSessionId(username);  // ???
    if (!onlineUser) return notFound;
  
    const message = PrivateMessage(to, from, text);
    socket.broadcast.to(onlineUser).emit('PrivateMessage', message);
    socket.emit('PrivateMessage', message);
  }
};

type SendMessageParams = {
  from:      string;
  text:      string;
  sessionId: string;
  socket:    Socket;
};
