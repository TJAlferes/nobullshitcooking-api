import { Socket } from 'socket.io';

import { IChatStore } from '../access/redis';
import { PublicMessage } from '.';

export async function sendMessage({ from, text, sessionId, socket, chatStore }: ISendMessage) {
  const room = Object.keys(socket.rooms).find(r => r !== sessionId);
  if (!room) return;

  const message = PublicMessage(room, from, text);  // const chatmessage = Chatmessage.create({chatroom_id, receiver_id, content, etc.});
  chatStore.createMessage(message);  // chatmessageRepo.insert(chatmessage)

  socket.broadcast.to(room).emit('Message', message);
  socket.emit('Message', message);
}

interface ISendMessage {
  from:      string;
  text:      string;
  sessionId: string;
  socket:    Socket;
  chatStore: IChatStore;
}
