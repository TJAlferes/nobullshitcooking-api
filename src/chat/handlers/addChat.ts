import { Socket } from 'socket.io';

import { IMessengerChat } from '../../redis-access/MessengerChat';
import { ChatMessage } from '../entities/ChatMessage';
import { ChatUser } from '../entities/ChatUser';

export async function addChat({
  id,
  username,
  avatar,
  socket,
  messengerChat,
  chatMessageText
}: IAddChat) {
  const room = Object.keys(socket.rooms).find(r => r !== socket.id);
  if (!room) return;

  const chat =
    ChatMessage(chatMessageText, room, ChatUser(id, username, avatar));

  await messengerChat.addChat(chat);
  
  socket.broadcast.to(room).emit('AddChat', chat);
  socket.emit('AddChat', chat);
}

interface IAddChat {
  id: number;
  username: string;
  avatar: string;
  socket: Socket;
  messengerChat: IMessengerChat;
  chatMessageText: string;
}