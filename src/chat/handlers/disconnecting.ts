import { Socket } from 'socket.io';

import { IFriendship } from '../../access/mysql';
import { IRoomStore, IUserStore } from '../../access/redis';

export async function disconnecting({
  //reason,
  id,
  username,
  socket,
  roomStore,
  userStore,
  friendship,
}: IDisconnecting) {
  //console.log('disconnecting; reason: ', reason);
  const clonedSocket: Partial<Socket> = {...socket};
  for (const room in clonedSocket.rooms) {
    if (room !== clonedSocket.id) {
      socket.broadcast.to(room).emit('RemoveUser', username);
      roomStore.removeUser(id, room);
    }
  }

  const acceptedFriends = await friendship.viewAccepted(id);
  if (acceptedFriends.length) {
    for (const friend of acceptedFriends) {
      const onlineFriend = await userStore.getSocketId(friend.username);
      if (!onlineFriend) continue;
      socket.broadcast.to(onlineFriend).emit('Offline', username);
    }
  }

  await userStore.remove(id);
}

export interface IDisconnecting {
  //reason: any;
  id: number;
  username: string;
  socket: Socket;
  roomStore: IRoomStore;
  userStore: IUserStore;
  friendship: IFriendship;
}