import { Socket } from 'socket.io';

import { IFriendship, IUser } from '../access/mysql';
import { IChatStore } from '../access/redis';
import { PrivateMessage } from '.';

export async function sendPrivateMessage({ to, from, text, socket, chatStore, friendship, user }: ISendPrivateMessage) {
  const notFound = socket.emit('FailedPrivateMessage', 'User not found.');

  const userExists = await user.getByName(to);
  if (!userExists.length) return notFound;
  
  const { id, username } = userExists;
  const blockedUsers = await friendship.viewBlocked(id);
  const blockedByUser = blockedUsers.find((u: any) => u.username === from);
  if (blockedByUser) return notFound;

  const onlineUser = await chatStore.getUserSocketId(username);
  if (!onlineUser) return notFound;

  const message = PrivateMessage(to, from, text);
  socket.broadcast.to(onlineUser).emit('PrivateMessage', message);
  socket.emit('PrivateMessage', message);
}

export interface ISendPrivateMessage {
  to: string;
  from: string;
  text: string;
  socket: Socket;
  chatStore: IChatStore;
  friendship: IFriendship;
  user: IUser;
}