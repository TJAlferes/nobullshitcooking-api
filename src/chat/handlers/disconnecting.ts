import { Socket } from 'socket.io';

import { IFriendship } from '../../access/mysql/Friendship';
import { IMessengerRoom } from '../../access/redis/MessengerRoom';
import { IMessengerUser } from '../../access/redis/MessengerUser';
import { ChatUser } from '../entities/ChatUser';

export async function disconnecting({
  reason,
  username,
  avatar,
  socket,
  messengerRoom,
  messengerUser,
  nobscFriendship,
}: IDisconnecting) {
  const clonedSocket: Partial<Socket> = {...socket};

  //console.log('disconnecting; reason: ', reason);

  for (let room in clonedSocket.rooms) {
    if (room !== clonedSocket.id) {
      socket.broadcast.to(room)
        .emit('RemoveUser', ChatUser(username, avatar));
      
      messengerRoom.removeUser(username, room);
    }
  }

  const acceptedFriends = await nobscFriendship.viewAccepted(username);

  if (acceptedFriends.length) {
    for (let f of acceptedFriends) {
      const onlineFriend = await messengerUser.getSocketId(f.username);

      if (!onlineFriend) continue;
      
      socket.broadcast.to(onlineFriend)
        .emit('ShowOffline', ChatUser(username, avatar));
    }
  }

  await messengerUser.remove(username);
}

export interface IDisconnecting {
  reason: any;
  username: string;
  avatar: string;
  socket: Socket;
  messengerRoom: IMessengerRoom;
  messengerUser: IMessengerUser;
  nobscFriendship: IFriendship;
}