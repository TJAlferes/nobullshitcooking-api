import { Socket } from 'socket.io';

import { IFriendship } from '../../access/mysql';
import { IChatUser } from '../../access/redis/ChatUser';

export async function getOnline({
  userId,
  username,
  socket,
  chatUser,
  friendship
}: IGetOnline) {
  const acceptedFriends = await friendship.viewAccepted(userId);
  if (!acceptedFriends.length) return;  // ?

  let online = [];
  for (let f of acceptedFriends) {
    // NOTE: right now you actually need the f.username, not the f.user_id
    const onlineFriend = await chatUser.getSocketId(f.user_id);
    if (!onlineFriend) continue;

    socket.broadcast.to(onlineFriend).emit('ShowOnline', username);
    online.push(f.username);
  }
  
  socket.emit('GetOnline', online);
}

export interface IGetOnline {
  userId: number;
  username: string;
  socket: Socket;
  chatUser: IChatUser;
  friendship: IFriendship;
}