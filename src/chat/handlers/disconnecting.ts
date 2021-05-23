import { Socket } from 'socket.io';

import { IFriendship } from '../../access/mysql';
import { IChatRoom } from '../../access/redis/ChatRoom';
import { IChatUser } from '../../access/redis/ChatUser';

export async function disconnecting({
  //reason,
  userId,
  username,
  socket,
  chatRoom,
  chatUser,
  friendship,
}: IDisconnecting) {
  //console.log('disconnecting; reason: ', reason);
  const clonedSocket: Partial<Socket> = {...socket};
  for (const room in clonedSocket.rooms) {
    if (room !== clonedSocket.id) {
      socket.broadcast.to(room).emit('RemoveUser', username);
      chatRoom.removeUser(username, room);
    }
  }

  const acceptedFriends = await friendship.viewAccepted(userId);
  if (acceptedFriends.length) {
    for (const friend of acceptedFriends) {
      const onlineFriend = await chatUser.getSocketId(friend.username);
      if (!onlineFriend) continue;
      socket.broadcast.to(onlineFriend).emit('ShowOffline', username);
    }
  }

  await chatUser.remove(username);
}

export interface IDisconnecting {
  //reason: any;
  userId: number;
  username: string;
  socket: Socket;
  chatRoom: IChatRoom;
  chatUser: IChatUser;
  friendship: IFriendship;
}