import { Socket } from 'socket.io';

import { IFriendship } from '../../mysql-access/Friendship';
import { IUser } from '../../mysql-access/User';
import { IMessengerUser } from '../../redis-access/MessengerUser';
import { ChatUser } from '../entities/ChatUser';
import { ChatWhisper } from '../entities/ChatWhisper';

export async function addWhisper({
  text,
  to,
  id,
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
    await nobscFriendship.viewBlocked(userExists[0].id);
  const blockedByUser = blockedUsers.find((u: any) => u.user_id === id);
  if (blockedByUser) return socket.emit('FailedWhisper', 'User not found.');
  const onlineUser = await messengerUser.getSocketId(userExists[0].id);
  if (!onlineUser) return socket.emit('FailedWhisper', 'User not found.');
  const whisper = ChatWhisper(text, to, ChatUser(id, username, avatar));
  socket.broadcast.to(onlineUser).emit('AddWhisper', whisper);
  socket.emit('AddWhisper', whisper);
}

interface IAddWhisper {
  text: string;
  to: string;
  id: number;
  username: string;
  avatar: string;
  socket: Socket;
  messengerUser: IMessengerUser;
  nobscFriendship: IFriendship;
  nobscUser: IUser;
}