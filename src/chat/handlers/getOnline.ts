import { Socket } from 'socket.io';

import { IFriendship } from '../../mysql-access/Friendship';
import { IMessengerUser } from '../../redis-access/MessengerUser';
import { ChatUser } from '../entities/ChatUser';

export async function getOnline({
  userId,
  username,
  avatar,
  socket,
  messengerUser,
  nobscFriendship
}: IGetOnline) {
  const acceptedFriends = await nobscFriendship
  .viewMyAcceptedFriendships(userId);

  if (!acceptedFriends.length) return;  // ?

  let online = [];

  for (let acceptedFriend of acceptedFriends) {
    const onlineFriend = await messengerUser
    .getUserSocketId(acceptedFriend.user_id);
    
    if (!onlineFriend) continue;

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

interface IGetOnline {
  userId: number;
  username: string;
  avatar: string;
  socket: Socket;
  messengerUser: IMessengerUser;
  nobscFriendship: IFriendship;
}