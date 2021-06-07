import { Socket } from 'socket.io';

import { IFriendship } from '../access/mysql';
import { IChatStore } from '../access/redis';

export async function disconnecting({
  id,
  username,
  socket,
  chatStore,
  friendship,
}: IDisconnecting) {
  const clonedSocket: Partial<Socket> = {...socket};
  for (const room in clonedSocket.rooms) {
    if (room !== clonedSocket.id) {
      socket.broadcast.to(room).emit('UserLeftRoom', username);
      chatStore.removeUserFromRoom(id, room);
    }
  }

  const acceptedFriends = await friendship.viewAccepted(id);
  if (acceptedFriends.length) {
    for (const friend of acceptedFriends) {
      const onlineFriend = await chatStore.getUserSocketId(friend.user_id);
      if (!onlineFriend) continue;
      socket.broadcast.to(onlineFriend).emit('FriendWentOffline', username);
    }
  }

  chatStore.deleteUser(id);
}

export interface IDisconnecting {
  id: number;
  username: string;
  socket: Socket;
  chatStore: IChatStore;
  friendship: IFriendship;
}