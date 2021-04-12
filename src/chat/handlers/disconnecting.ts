import { Socket } from 'socket.io';

import { IFriendship } from '../../access/mysql';
import { IChatRoom } from '../../access/redis/ChatRoom';
import { IChatUser } from '../../access/redis/ChatUser';

export async function disconnecting({
  reason,
  username,
  socket,
  chatRoom,
  chatUser,
  friendship,
}: IDisconnecting) {
  const clonedSocket: Partial<Socket> = {...socket};

  //console.log('disconnecting; reason: ', reason);

  for (let room in clonedSocket.rooms) {
    if (room !== clonedSocket.id) {
      socket.broadcast.to(room).emit('RemoveUser', username);
      
      chatRoom.removeUser(username, room);
    }
  }

  const acceptedFriends = await friendship.viewAccepted(username);

  if (acceptedFriends.length) {
    for (let f of acceptedFriends) {
      const onlineFriend = await chatUser.getSocketId(f.username);

      if (!onlineFriend) continue;
      
      socket.broadcast.to(onlineFriend).emit('ShowOffline', username);
    }
  }

  await chatUser.remove(username);
}

export interface IDisconnecting {
  reason: any;
  username: string;
  socket: Socket;
  chatRoom: IChatRoom;
  chatUser: IChatUser;
  friendship: IFriendship;
}