import { Socket } from 'socket.io';

import { IMessageStore } from '../../access/redis';
import { PublicMessage } from '../entities/PublicMessage';

export async function addMessage({
  from,  // id, username,
  text,
  socket,
  messageStore
}: IAddMessage) {
  const room = Object.keys(socket.rooms).find(r => r !== socket.id);
  if (!room) return;

  const message = PublicMessage(room, from, text);
  await messageStore.add(message);

  socket.broadcast.to(room).emit('AddMessage', message);
  socket.emit('AddMessage', message);
}

interface IAddMessage {
  from: string;
  text: string;
  socket: Socket;
  messageStore: IMessageStore;
}