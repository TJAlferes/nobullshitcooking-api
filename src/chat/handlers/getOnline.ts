import { Socket } from 'socket.io';

import { IFriendship } from '../../access/mysql/Friendship';
import { IMessengerUser } from '../../access/redis/MessengerUser';

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

    socket.broadcast.to(onlineFriend).emit('ShowOnline', username);
    
    online.push(f.username);
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