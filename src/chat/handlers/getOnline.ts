import { Socket } from 'socket.io';

import { IFriendship } from '../../access/mysql/Friendship';
import { IMessengerUser } from '../../access/redis/MessengerUser';
import { ChatUser } from '../entities/ChatUser';

export async function getOnline({
  username,
  avatar,
  socket,
  messengerUser,
  nobscFriendship
}: IGetOnline) {
  const acceptedFriends = await nobscFriendship.viewAccepted(username);

  if (!acceptedFriends.length) return;  // ?

  let online = [];

  for (let f of acceptedFriends) {
    const onlineFriend = await messengerUser.getSocketId(f.user_id);

    if (!onlineFriend) continue;

    socket.broadcast.to(onlineFriend)
      .emit('ShowOnline', ChatUser(username, avatar));
    
    online.push(ChatUser(f.username, f.avatar));
  }
  
  socket.emit('GetOnline', online);
}

export interface IGetOnline {
  username: string;
  avatar: string;
  socket: Socket;
  messengerUser: IMessengerUser;
  nobscFriendship: IFriendship;
}