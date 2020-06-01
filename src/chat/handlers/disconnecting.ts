import { Socket } from 'socket.io';

import { IMessengerRoom } from '../../redis-access/MessengerRoom';
import { IMessengerUser } from '../../redis-access/MessengerUser';
import { ChatUser  } from '../entities/ChatUser';

export async function disconnecting(
  socket: Socket,
  messengerRoom: IMessengerRoom,
  messengerUser: IMessengerUser,
  nobscFriendship,
  userId: number,
  username: string,
  avatar: string,
  reason: any
) {
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
  .viewAllMyAcceptedFriendships(userId);

  if (!acceptedFriends.length) return;

  for (let acceptedFriend of acceptedFriends) {
    const onlineFriend = await messengerUser
    .getUserSocketId(acceptedFriend.user_id);

    if (!onlineFriend) return;

    socket.broadcast.to(onlineFriend)
    .emit('ShowOffline', ChatUser(userId, username, avatar));
  }

  await messengerUser.removeUser(userId);
}