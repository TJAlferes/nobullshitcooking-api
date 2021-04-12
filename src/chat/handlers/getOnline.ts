import { Socket } from 'socket.io';

import { IFriendship } from '../../access/mysql';
import { IChatUser } from '../../access/redis/ChatUser';

export async function getOnline({
  username,
  avatar,
  socket,
  chatUser,
  friendship
}: IGetOnline) {
  const acceptedFriends = await friendship.viewAccepted(username);

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
  friendship: IFriendship;
}