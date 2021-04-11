import { Socket } from 'socket.io';

import { IFriendship } from '../../access/mysql/Friendship';
import { IUser } from '../../access/mysql/User';
import { IChatUser } from '../../access/redis/ChatUser';
import { PrivateMessage } from '../entities/PrivateMessage';

export async function addPrivateMessage({
  to,
  from,
  text,
  socket,
  chatUser,
  nobscFriendship,
  nobscUser
}: IAddPrivateMessage) {
  const [ userExists ] = await nobscUser.getByName(to);

  if (!userExists.length) {
    return socket.emit('FailedPrivateMessage', 'User not found.');
  }

  const [ blockedUsers ] =
    await nobscFriendship.viewBlocked(userExists[0].username);
    
  const blockedByUser = blockedUsers.find((u: any) => u.username === from);

  if (blockedByUser) {
    return socket.emit('FailedPrivateMessage', 'User not found.');
  }

  const onlineUser = await chatUser.getSocketId(userExists[0].id);  // ?

  if (!onlineUser) {
    return socket.emit('FailedPrivateMessage', 'User not found.');
  }

  const privateMessage = PrivateMessage(to, from, text);

  socket.broadcast.to(onlineUser).emit('AddPrivateMessage', privateMessage);

  socket.emit('AddPrivateMessage', privateMessage);
}

export interface IAddPrivateMessage {
  to: string;
  from: string;
  text: string;
  socket: Socket;
  chatUser: IChatUser;
  nobscFriendship: IFriendship;
  nobscUser: IUser;
}