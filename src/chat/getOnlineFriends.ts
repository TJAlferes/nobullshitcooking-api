import { Socket } from 'socket.io';

import { IFriendship } from '../access/mysql';
import { IChatStore } from '../access/redis';

export async function getOnlineFriends({ id, username, socket, chatStore, friendship }: IGetOnlineFriends) {
  const acceptedFriends = await friendship.viewAccepted(id);
  if (!acceptedFriends.length) return;

  const friends = [];
  for (const acceptedFriend of acceptedFriends) {
    const friend = await chatStore.getUserSessionId(acceptedFriend.username);
    if (!friend) continue;

    socket.broadcast.to(friend).emit('FriendCameOnline', username);
    friends.push(acceptedFriend.username);
  }
  
  socket.emit('OnlineFriends', friends);
}

export interface IGetOnlineFriends {
  id:         number;
  username:   string;
  socket:     Socket;
  chatStore:  IChatStore;
  friendship: IFriendship;
}