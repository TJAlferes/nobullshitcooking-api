import { Socket } from 'socket.io';

import { IFriendship } from '../../access/mysql/Friendship';
import { IUser } from '../../access/mysql/User';
import { IMessengerUser } from '../../access/redis/MessengerUser';
import { ChatUser } from '../entities/ChatUser';
import { ChatWhisper } from '../entities/ChatWhisper';

export async function addWhisper({
  text,
  to,
  username,
  avatar,
  socket,
  messengerUser,
  nobscFriendship,
  nobscUser
}: IAddWhisper) {
  const [ userExists ] = await nobscUser.getByName(to);

  if (!userExists.length) {
    return socket.emit('FailedWhisper', 'User not found.');
  }

  const [ blockedUsers ] =
    await nobscFriendship.viewBlocked(userExists[0].username);
  
  const blockedByUser = blockedUsers.find((u: any) => u.username === username);

  if (blockedByUser) return socket.emit('FailedWhisper', 'User not found.');

  const onlineUser = await messengerUser.getSocketId(userExists[0].id);  // ?

  if (!onlineUser) return socket.emit('FailedWhisper', 'User not found.');

  const whisper = ChatWhisper(text, to, ChatUser(username, avatar));

  socket.broadcast.to(onlineUser).emit('AddWhisper', whisper);
  
  socket.emit('AddWhisper', whisper);
}

export interface IAddWhisper {
  text: string;
  to: string;
  username: string;
  avatar: string;
  socket: Socket;
  messengerUser: IMessengerUser;
  nobscFriendship: IFriendship;
  nobscUser: IUser;
}