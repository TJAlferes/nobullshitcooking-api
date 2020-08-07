import { Socket } from 'socket.io';

import { IFriendship } from '../../mysql-access/Friendship';
import { IMessengerUser } from '../../redis-access/MessengerUser';
import { ChatUser } from '../entities/ChatUser';

export async function getOnline({
  id,
  username,
  avatar,
  socket,
  messengerUser,
  nobscFriendship
}: IGetOnline) {
  const acceptedFriends = await nobscFriendship.viewAccepted(id);
  if (!acceptedFriends.length) return;  // ?

  let online = [];

  for (let f of acceptedFriends) {
    const onlineFriend = await messengerUser.getUserSocketId(f.user_id);
    if (!onlineFriend) continue;

    socket.broadcast.to(onlineFriend)
      .emit('ShowOnline', ChatUser(id, username, avatar));

    online.push(ChatUser(f.user_id, f.username, f.avatar));
  }
  
  socket.emit('GetOnline', online);
}

interface IGetOnline {
  id: number;
  username: string;
  avatar: string;
  socket: Socket;
  messengerUser: IMessengerUser;
  nobscFriendship: IFriendship;
}