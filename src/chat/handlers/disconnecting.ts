import { Socket } from 'socket.io';

import { IFriendship } from '../../mysql-access/Friendship';
import { IMessengerRoom } from '../../redis-access/MessengerRoom';
import { IMessengerUser } from '../../redis-access/MessengerUser';
import { ChatUser  } from '../entities/ChatUser';

export async function disconnecting({
  reason,
  id,
  username,
  avatar,
  socket,
  messengerRoom,
  messengerUser,
  nobscFriendship,
}: IDisconnecting) {
  const clonedSocket = {...socket};
  //console.log('disconnecting; reason: ', reason);
  
  for (let room in clonedSocket.rooms) {
    if (room !== clonedSocket.id) {
      socket.broadcast.to(room)
        .emit('RemoveUser', ChatUser(id, username, avatar));

      messengerRoom.removeUser(id, room);
    }
  }

  const acceptedFriends = await nobscFriendship.viewAccepted(id);

  if (acceptedFriends.length) {
    for (let f of acceptedFriends) {
      const onlineFriend = await messengerUser.getSocketId(f.user_id);
      if (!onlineFriend) continue;

      socket.broadcast.to(onlineFriend)
        .emit('ShowOffline', ChatUser(id, username, avatar));
    }
  }

  await messengerUser.remove(id);
}

interface IDisconnecting {
  reason: any;
  id: number;
  username: string;
  avatar: string;
  socket: Socket;
  messengerRoom: IMessengerRoom;
  messengerUser: IMessengerUser;
  nobscFriendship: IFriendship;
}