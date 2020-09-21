import { Socket } from 'socket.io';

import { IMessengerChat } from '../../redis-access/MessengerChat';
import { ChatMessage } from '../entities/ChatMessage';
import { ChatUser } from '../entities/ChatUser';

export async function addMessage({
  id,
  username,
  avatar,
  socket,
  messengerChat,
  text
}: IAddMessage) {
  const room = Object.keys(socket.rooms).find(r => r !== socket.id);
  if (!room) return;
  const message = ChatMessage(text, room, ChatUser(id, username, avatar));
  await messengerChat.addMessage(message);
  socket.broadcast.to(room).emit('AddMessage', message);
  socket.emit('AddMessage', message);
}

interface IAddMessage {
  id: number;
  username: string;
  avatar: string;
  socket: Socket;
  messengerChat: IMessengerChat;
  text: string;
}