import { Socket } from 'socket.io';

import { IMessengerUser } from '../../redis-access/MessengerUser';
import { ChatUser  } from '../entities/ChatUser';

export async function getOnline(
  socket: Socket,
  nobscFriendship,
  messengerUser: IMessengerUser,
  userId: number,
  username: string,
  avatar: string
) {
  const acceptedFriends = await nobscFriendship
  .viewAllMyAcceptedFriendships(userId);

  if (!acceptedFriends.length) return;

  let online = [];

  for (let acceptedFriend of acceptedFriends) {
    const onlineFriend = await messengerUser
    .getUserSocketId(acceptedFriend.user_id);
    
    if (!onlineFriend) return;

    socket.broadcast.to(onlineFriend)
    .emit('ShowOnline', ChatUser(userId, username, avatar));

    online.push(ChatUser(
      acceptedFriend.user_id,
      acceptedFriend.username,
      acceptedFriend.avatar
    ));
  }

  socket.emit('GetOnline', online);
}