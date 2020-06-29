import { Socket } from 'socket.io';

import { IFriendship } from '../../mysql-access/Friendship';
import { IMessengerRoom } from '../../redis-access/MessengerRoom';
import { IMessengerUser } from '../../redis-access/MessengerUser';
import { ChatUser  } from '../entities/ChatUser';

export async function disconnecting({
  reason,
  userId,
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
      .emit('RemoveUser', ChatUser(userId, username, avatar));

      messengerRoom.removeUserFromRoom(userId, room);
    }
  }

  const acceptedFriends = await nobscFriendship
  .viewMyAcceptedFriendships(userId);

  if (acceptedFriends.length) {
    for (let acceptedFriend of acceptedFriends) {
      const onlineFriend = await messengerUser
      .getUserSocketId(acceptedFriend.user_id);

      if (!onlineFriend) continue;

      socket.broadcast.to(onlineFriend)
      .emit('ShowOffline', ChatUser(userId, username, avatar));
    }
  }

  await messengerUser.removeUser(userId);
}

interface IDisconnecting {
  reason: any;
  userId: number;
  username: string;
  avatar: string;
  socket: Socket;
  messengerRoom: IMessengerRoom;
  messengerUser: IMessengerUser;
  nobscFriendship: IFriendship;
}