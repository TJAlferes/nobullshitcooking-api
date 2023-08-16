import { Socket } from 'socket.io';

import { IFriendship } from '../access/mysql';
import { IChatStore } from '../access/redis';

export async function disconnecting({ sessionId, id, username, socket, chatStore, friendship }: IDisconnecting) {
  const clonedSocket: Partial<Socket> = {...socket};
  
  for (const room in clonedSocket.rooms) {
    if (room !== sessionId) {
      socket.broadcast.to(room).emit('UserLeftRoom', username);
      chatStore.removeUserFromRoom(username, room);  // chatroomUserRepo.removeUserFromChatroom({user_id, chatroom_id})
    }
  }

  const friends = await friendship.viewAccepted(id);
  if (friends.length) {
    for (const friend of friends) {
      const onlineFriend = await chatStore.getUserSessionId(friend.username);  // ???
      if (!onlineFriend) continue;
      socket.broadcast.to(onlineFriend).emit('FriendWentOffline', username);
    }
  }

  chatStore.deleteUser(username);  // ???
}

export interface IDisconnecting {
  sessionId:  string;
  id:         number;
  username:   string;
  socket:     Socket;
  chatStore:  IChatStore;
  friendship: IFriendship;
}
