import { Socket } from 'socket.io';

import { IFriendship } from '../../access/mysql';
import { IUserStore } from '../../access/redis';

export async function viewOnlineFriends({
  id,
  username,
  socket,
  userStore,
  friendship
}: IViewOnlineFriends) {
  const friends = await friendship.viewAccepted(id);
  if (!friends.length) return;

  const onlineFriends = [];
  for (const friend of friends) {
    const onlineFriend = await userStore.getSocketId(friend.user_id);
    if (!onlineFriend) continue;

    socket.broadcast.to(onlineFriend).emit('Online', {id, username});
    onlineFriends.push({id: friend.user_id, username: friend.username});
  }
  
  socket.emit('OnlineFriends', onlineFriends);
}

export interface IViewOnlineFriends {
  id: number;
  username: string;
  socket: Socket;
  userStore: IUserStore;
  friendship: IFriendship;
}