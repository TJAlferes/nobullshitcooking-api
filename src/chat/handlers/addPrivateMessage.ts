import { Socket } from 'socket.io';

import { IFriendship, IUser } from '../../access/mysql';
import { IChatUser } from '../../access/redis/ChatUser';
import { PrivateMessage } from '../entities/PrivateMessage';

export async function addPrivateMessage({
  to,
  from,
  text,
  socket,
  chatUser,
  friendship,
  user
}: IAddPrivateMessage) {
  const userExists = await user.getByName(to);
  if (!userExists.length) {
    return socket.emit('FailedPrivateMessage', 'User not found.');
  }
  
  const { id, username } = userExists;
  const [ blockedUsers ] = await friendship.viewBlocked(username);
  const blockedByUser = blockedUsers.find((u: any) => u.username === from);
  if (blockedByUser) {
    return socket.emit('FailedPrivateMessage', 'User not found.');
  }

  const onlineUser = await chatUser.getSocketId(id);  // ?
  if (!onlineUser) {
    return socket.emit('FailedPrivateMessage', 'User not found.');
  }

  const message = PrivateMessage(to, from, text);
  //socket.to(to).to(from).emit('AddPrivateMessage', message);
  socket.broadcast.to(onlineUser).emit('AddPrivateMessage', message);
  socket.emit('AddPrivateMessage', message);
}

export interface IAddPrivateMessage {
  to: string;
  from: string;
  text: string;
  socket: Socket;
  chatUser: IChatUser;
  friendship: IFriendship;
  user: IUser;
}