import { Socket } from 'socket.io';

import { IFriendship } from '../access/mysql';
import { IChatStore } from '../access/redis';

export async function getOnlineFriends({
  id,
  username,
  socket,
  chatStore,
  friendship
}: IGetOnlineFriends) {
  const friends = await friendship.viewAccepted(id);
  if (!friends.length) return;

  const onlineFriends = [];
  for (const friend of friends) {
    const onlineFriend = await chatStore.getUserSocketId(friend.username);
    if (!onlineFriend) continue;

    socket.broadcast.to(onlineFriend).emit('FriendCameOnline', username);
    onlineFriends.push(friend.username);
  }
  
  socket.emit('OnlineFriends', onlineFriends);
}

export interface IGetOnlineFriends {
  id: number;
  username: string;
  socket: Socket;
  chatStore: IChatStore;
  friendship: IFriendship;
}