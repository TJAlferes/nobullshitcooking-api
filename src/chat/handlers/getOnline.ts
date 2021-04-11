import { Socket } from 'socket.io';

import { IFriendship } from '../../access/mysql/Friendship';
import { IChatUser } from '../../access/redis/ChatUser';

export async function getOnline({
  username,
  avatar,
  socket,
  chatUser,
  nobscFriendship
}: IGetOnline) {
  const acceptedFriends = await nobscFriendship.viewAccepted(username);

  if (!acceptedFriends.length) return;  // ?

  let online = [];

  for (let f of acceptedFriends) {
    const onlineFriend = await chatUser.getSocketId(f.user_id);

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
  chatUser: IChatUser;
  nobscFriendship: IFriendship;
}