import { Socket } from 'socket.io';

import { IChatMessage } from '../../access/redis/ChatMessage';
import { PublicMessage } from '../entities/PublicMessage';

export async function addPublicMessage({
  from,
  text,
  socket,
  chatMessage
}: IAddPublicMessage) {
  const room = Object.keys(socket.rooms).find(r => r !== socket.id);

  if (!room) return;

  const publicMessage = PublicMessage(room, from, text);

  await chatMessage.addMessage(publicMessage);

  socket.broadcast.to(room).emit('AddMessage', publicMessage);
  
  socket.emit('AddMessage', publicMessage);
}

interface IAddPublicMessage {
  from: string;
  text: string;
  socket: Socket;
  chatMessage: IChatMessage;
}