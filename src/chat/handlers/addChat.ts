import { ChatMessage  } from '../entities/ChatMessage';
import { ChatUser  } from '../entities/ChatUser';

export async function addChat(
  socket,
  messengerChat,
  chatMessageText: string,
  userId: number,
  username: string,
  avatar: string
) {
  const room = Object.keys(socket.rooms).find(r => r !== socket.id);
  if (!room) return;

  const chat = ChatMessage(
    chatMessageText,
    room,
    ChatUser(userId, username, avatar)
  );

  await messengerChat.addChat(chat);
  
  socket.broadcast.to(room).emit('AddChat', chat);
  socket.emit('AddChat', chat);
}