import { Socket } from 'socket.io';

import { IChatStore } from '../access/redis';
import { PublicMessage } from '.';

export async function sendMessage({ from, text, socket, chatStore }: ISendMessage) {
  const room = Object.keys(socket.rooms).find(r => r !== socket.id);
  if (!room) return;

  const message = PublicMessage(room, from, text);
  chatStore.createMessage(message);

  socket.broadcast.to(room).emit('Message', message);
  socket.emit('Message', message);
}

interface ISendMessage {
  from: string;
  text: string;
  socket: Socket;
  chatStore: IChatStore;
}