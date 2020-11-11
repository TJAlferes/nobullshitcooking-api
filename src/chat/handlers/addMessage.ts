import { Socket } from 'socket.io';

import { IMessengerChat } from '../../access/redis/MessengerChat';
import { ChatMessage } from '../entities/ChatMessage';
import { ChatUser } from '../entities/ChatUser';

export async function addMessage({
  username,
  avatar,
  socket,
  messengerChat,
  text
}: IAddMessage) {
  const room = Object.keys(socket.rooms).find(r => r !== socket.id);

  if (!room) return;

  const message = ChatMessage(text, room, ChatUser(username, avatar));

  await messengerChat.addMessage(message);

  socket.broadcast.to(room).emit('AddMessage', message);
  
  socket.emit('AddMessage', message);
}

interface IAddMessage {
  username: string;
  avatar: string;
  socket: Socket;
  messengerChat: IMessengerChat;
  text: string;
}